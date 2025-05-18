from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.models import User, UserRole
from app.schemas.schemas import TokenData

# Konfiguration für JWT
SECRET_KEY = "YOUR_SECRET_KEY_HERE"  # In Produktion sollte dies in einer .env-Datei gespeichert werden
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Passwort-Hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 mit Password Flow
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def verify_password(plain_password, hashed_password):
    """Überprüft, ob das eingegebene Passwort mit dem gehashten Passwort übereinstimmt"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    """Erstellt einen Hash für das Passwort"""
    return pwd_context.hash(password)

def get_user(db: Session, username: str):
    """Holt einen Benutzer aus der Datenbank anhand des Benutzernamens"""
    return db.query(User).filter(User.username == username).first()

def authenticate_user(db: Session, username: str, password: str):
    """Authentifiziert einen Benutzer anhand von Benutzername und Passwort"""
    user = get_user(db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Erstellt ein JWT-Token für den authentifizierten Benutzer"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Holt den aktuellen Benutzer anhand des JWT-Tokens"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Ungültige Anmeldeinformationen",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        role: str = payload.get("role")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username, role=role)
    except JWTError:
        raise credentials_exception
    user = get_user(db, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(current_user: User = Depends(get_current_user)):
    """Überprüft, ob der aktuelle Benutzer aktiv ist"""
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inaktiver Benutzer")
    return current_user

async def get_current_admin_user(current_user: User = Depends(get_current_user), token: str = Depends(oauth2_scheme)):
    """Überprüft, ob der aktuelle Benutzer ein Administrator ist"""
    # Überprüfe die Rolle im Token
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        role = payload.get("role")
        
        # Überprüfe sowohl die Rolle im Token als auch in der Datenbank
        if role != UserRole.ADMIN.value or current_user.role != UserRole.ADMIN:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Nicht genügend Berechtigungen"
            )
        return current_user
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Ungültige Anmeldeinformationen",
            headers={"WWW-Authenticate": "Bearer"},
        )
