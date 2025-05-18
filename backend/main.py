import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from fastapi.security import OAuth2PasswordBearer
import logging

# .env-Datei laden
load_dotenv()
import uvicorn

from app.db.database import engine, SessionLocal
from app.models.models import Base, User, UserRole
from app.api import cards, sets, decks, sync, users
from app.scripts.create_admin import create_admin_user

# Datenbank-Tabellen erstellen
Base.metadata.create_all(bind=engine)

# Admin-Benutzer erstellen, wenn noch keiner existiert
try:
    admin_created = create_admin_user()
    if admin_created:
        print("Admin-Benutzer wurde erstellt. Benutzername: admin, Passwort: admin")
    else:
        print("Admin-Benutzer existiert bereits.")
except Exception as e:
    print(f"Fehler beim Erstellen des Admin-Benutzers: {e}")

# FastAPI-App initialisieren
app = FastAPI(
    title="Magic Frog API",
    description="API für die Magic: The Gathering Deck Builder App",
    version="0.1.0"
)

# CORS-Middleware hinzufügen, um Cross-Origin-Anfragen zu erlauben
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API-Routen einbinden
app.include_router(cards.router)
app.include_router(sets.router)
app.include_router(decks.router)
app.include_router(sync.router)
app.include_router(users.router)

@app.get("/")
def read_root():
    return {"message": "Willkommen zur Magic Frog API"}

# Server starten, wenn Skript direkt ausgeführt wird
if __name__ == "__main__":
    host = os.getenv("API_HOST", "0.0.0.0")
    port = int(os.getenv("API_PORT", "8000"))
    debug = os.getenv("API_DEBUG", "true").lower() == "true"
    
    uvicorn.run("main:app", host=host, port=port, reload=debug)
