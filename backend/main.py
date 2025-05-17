import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# .env-Datei laden
load_dotenv()
import uvicorn

from app.db.database import engine
from app.models.models import Base
from app.api import cards, sets, decks, sync

# Datenbank-Tabellen erstellen
Base.metadata.create_all(bind=engine)

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

@app.get("/")
def read_root():
    return {"message": "Willkommen zur Magic Frog API"}

# Server starten, wenn Skript direkt ausgeführt wird
if __name__ == "__main__":
    host = os.getenv("API_HOST", "0.0.0.0")
    port = int(os.getenv("API_PORT", "8000"))
    debug = os.getenv("API_DEBUG", "true").lower() == "true"
    
    uvicorn.run("main:app", host=host, port=port, reload=debug)
