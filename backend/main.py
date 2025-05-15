from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from app.db.database import engine
from app.models.models import Base
from app.api import cards, sets

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
    allow_origins=["http://localhost:3000"],  # React-App URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API-Routen einbinden
app.include_router(cards.router)
app.include_router(sets.router)

@app.get("/")
def read_root():
    return {"message": "Willkommen zur Magic Frog API"}

# Server starten, wenn Skript direkt ausgeführt wird
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
