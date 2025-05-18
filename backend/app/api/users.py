from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import List

from app.db.database import get_db
from app.models.models import User, UserRole
from app.schemas.schemas import UserCreate, User as UserSchema, UserUpdate, Token
from app.auth.auth import (
    authenticate_user, create_access_token, get_password_hash,
    ACCESS_TOKEN_EXPIRE_MINUTES, get_current_active_user, get_current_admin_user
)

router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"description": "Not found"}},
)

@router.post("/register", response_model=UserSchema)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    """Registriert einen neuen Benutzer"""
    # Überprüfen, ob Benutzername bereits existiert
    db_user_by_username = db.query(User).filter(User.username == user.username).first()
    if db_user_by_username:
        raise HTTPException(status_code=400, detail="Benutzername bereits vergeben")
    
    # Überprüfen, ob E-Mail bereits existiert
    db_user_by_email = db.query(User).filter(User.email == user.email).first()
    if db_user_by_email:
        raise HTTPException(status_code=400, detail="E-Mail bereits registriert")
    
    # Erstelle den ersten Benutzer als Admin
    is_first_user = db.query(User).count() == 0
    
    # Neuen Benutzer erstellen
    hashed_password = get_password_hash(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        role=UserRole.ADMIN if is_first_user else UserRole.USER
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/token", response_model=Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Erstellt ein Token für einen authentifizierten Benutzer"""
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Ungültiger Benutzername oder Passwort",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    # Prüfe, ob der Benutzer aktiv ist
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Benutzer ist deaktiviert",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    # Bestimme, ob der Benutzer ein Admin ist
    is_admin = user.role == UserRole.ADMIN
    
    # Speichere die Benutzer-ID, den Benutzernamen und die Rolle im Token
    access_token = create_access_token(
        data={
            "sub": user.username,
            "user_id": user.id,
            "role": user.role.value,
            "is_admin": is_admin
        },
        expires_delta=access_token_expires
    )
    
    
    return {"access_token": access_token, "token_type": "bearer", "is_admin": is_admin}

@router.get("/me", response_model=UserSchema)
def read_users_me(current_user: User = Depends(get_current_active_user)):
    """Gibt Informationen über den aktuellen Benutzer zurück"""
    return current_user

@router.get("/", response_model=List[UserSchema])
def read_users(skip: int = 0, limit: int = 100, current_user: User = Depends(get_current_admin_user), db: Session = Depends(get_db)):
    """Gibt eine Liste aller Benutzer zurück (nur für Administratoren)"""
    users = db.query(User).offset(skip).limit(limit).all()
    return users

@router.get("/{user_id}", response_model=UserSchema)
def read_user(user_id: int, current_user: User = Depends(get_current_admin_user), db: Session = Depends(get_db)):
    """Gibt Informationen über einen bestimmten Benutzer zurück (nur für Administratoren)"""
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="Benutzer nicht gefunden")
    return db_user

@router.put("/{user_id}", response_model=UserSchema)
def update_user(user_id: int, user: UserUpdate, current_user: User = Depends(get_current_admin_user), db: Session = Depends(get_db)):
    """Aktualisiert einen Benutzer (nur für Administratoren)"""
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="Benutzer nicht gefunden")
    
    # Aktualisiere die Benutzerinformationen
    if user.username is not None:
        # Überprüfen, ob Benutzername bereits existiert
        existing_user = db.query(User).filter(User.username == user.username).first()
        if existing_user and existing_user.id != user_id:
            raise HTTPException(status_code=400, detail="Benutzername bereits vergeben")
        db_user.username = user.username
    
    if user.email is not None:
        # Überprüfen, ob E-Mail bereits existiert
        existing_user = db.query(User).filter(User.email == user.email).first()
        if existing_user and existing_user.id != user_id:
            raise HTTPException(status_code=400, detail="E-Mail bereits registriert")
        db_user.email = user.email
    
    if user.is_active is not None:
        db_user.is_active = user.is_active
    
    if user.role is not None:
        db_user.role = user.role
    
    db.commit()
    db.refresh(db_user)
    return db_user

@router.delete("/{user_id}", response_model=UserSchema)
def delete_user(user_id: int, current_user: User = Depends(get_current_admin_user), db: Session = Depends(get_db)):
    """Löscht einen Benutzer (nur für Administratoren)"""
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="Benutzer nicht gefunden")
    
    # Verhindere das Löschen des eigenen Kontos
    if db_user.id == current_user.id:
        raise HTTPException(status_code=400, detail="Du kannst dein eigenes Konto nicht löschen")
    
    db.delete(db_user)
    db.commit()
    return db_user
