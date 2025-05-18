"""
Skript zum Erstellen eines Admin-Benutzers, wenn noch keiner existiert.
"""
import sys
import os
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

# Füge das Elternverzeichnis zum Pfad hinzu, damit wir die App-Module importieren können
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.db.database import SessionLocal, engine
from app.models.models import User, UserRole
from app.auth.auth import get_password_hash

def create_admin_user(username="admin", email="admin@magicfrog.com", password="admin"):
    """Erstellt einen Admin-Benutzer, wenn noch keiner existiert."""
    db = SessionLocal()
    try:
        # Prüfen, ob bereits ein Admin existiert
        admin_exists = db.query(User).filter(User.role == UserRole.ADMIN).first()
        
        if not admin_exists:
            # Admin-Benutzer erstellen
            hashed_password = get_password_hash(password)
            admin_user = User(
                username=username,
                email=email,
                hashed_password=hashed_password,
                role=UserRole.ADMIN,
                is_active=True
            )
            
            db.add(admin_user)
            db.commit()
            print(f"Admin-Benutzer '{username}' wurde erfolgreich erstellt.")
            return True
        else:
            # Stelle sicher, dass der bestehende Admin-Benutzer aktiv ist
            if not admin_exists.is_active:
                admin_exists.is_active = True
                db.commit()
                print(f"Admin-Benutzer '{admin_exists.username}' wurde aktiviert.")
            print(f"Admin-Benutzer '{admin_exists.username}' existiert bereits.")
            return False
    except SQLAlchemyError as e:
        db.rollback()
        print(f"Fehler beim Erstellen des Admin-Benutzers: {e}")
        return False
    finally:
        db.close()

if __name__ == "__main__":
    # Benutzerangaben aus Kommandozeilenargumenten oder Standardwerte verwenden
    username = sys.argv[1] if len(sys.argv) > 1 else "admin"
    email = sys.argv[2] if len(sys.argv) > 2 else "admin@magicfrog.com"
    password = sys.argv[3] if len(sys.argv) > 3 else "admin"
    
    create_admin_user(username, email, password)
