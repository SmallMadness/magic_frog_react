import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# .env-Datei laden
load_dotenv()

# Datenbankverbindungsstring aus Umgebungsvariablen
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./magic_cards.db")

# Engine erstellen
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# SessionLocal-Klasse erstellen
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base-Klasse für Modelle
Base = declarative_base()

# Dependency für FastAPI
def get_db():
    """Datenbankverbindung für API-Routen bereitstellen"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
