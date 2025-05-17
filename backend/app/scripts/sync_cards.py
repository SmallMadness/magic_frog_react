"""
Skript zum Synchronisieren von Karten aus der Scryfall-API
Dieses Skript sollte regelmäßig (z.B. einmal pro Woche) ausgeführt werden,
um die lokale Datenbank mit den neuesten Karten aus der Scryfall-API zu aktualisieren.
"""

import os
import time
import json
import logging
from datetime import datetime
import requests
from sqlalchemy.orm import Session

from app.db.database import SessionLocal, engine
from app.models.models import Card, Set, Color, Base

# Logging konfigurieren
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("sync_cards.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Scryfall API URLs
SCRYFALL_SETS_URL = "https://api.scryfall.com/sets"
SCRYFALL_CARDS_URL = "https://api.scryfall.com/cards/search"
SCRYFALL_BULK_DATA_URL = "https://api.scryfall.com/bulk-data"

# Maximale Anzahl von Anfragen pro Sekunde (Scryfall Rate Limit)
MAX_REQUESTS_PER_SECOND = 10
REQUEST_DELAY = 1.0 / MAX_REQUESTS_PER_SECOND

def get_db():
    """Datenbankverbindung herstellen"""
    db = SessionLocal()
    try:
        return db
    finally:
        db.close()

def fetch_json(url, params=None):
    """JSON von einer URL abrufen mit Rate Limiting"""
    time.sleep(REQUEST_DELAY)  # Rate Limiting
    response = requests.get(url, params=params)
    response.raise_for_status()
    return response.json()

def sync_sets(db: Session):
    """Sets aus der Scryfall-API synchronisieren"""
    logger.info("Synchronisiere Sets...")
    
    # Sets von Scryfall abrufen
    sets_data = fetch_json(SCRYFALL_SETS_URL)
    
    # Anzahl der Sets
    total_sets = len(sets_data.get("data", []))
    logger.info(f"Gefunden: {total_sets} Sets")
    
    # Sets in der Datenbank aktualisieren
    for set_data in sets_data.get("data", []):
        # Nur relevante Felder extrahieren
        set_info = {
            "code": set_data.get("code"),
            "name": set_data.get("name"),
            "release_date": set_data.get("released_at"),
            "set_type": set_data.get("set_type"),
            "card_count": set_data.get("card_count"),
            "icon_url": set_data.get("icon_svg_uri")
        }
        
        # Set in der Datenbank suchen oder erstellen
        db_set = db.query(Set).filter(Set.code == set_info["code"]).first()
        if db_set:
            # Set aktualisieren
            for key, value in set_info.items():
                setattr(db_set, key, value)
        else:
            # Neues Set erstellen
            db_set = Set(**set_info)
            db.add(db_set)
    
    # Änderungen speichern
    db.commit()
    logger.info("Sets synchronisiert")

def get_bulk_data_url():
    """Holt die URL für die Bulk Data von der Scryfall API"""
    logger.info("Hole Bulk Data URL...")
    
    # Bulk Data URL abrufen
    bulk_data = fetch_json(SCRYFALL_BULK_DATA_URL)
    default_cards_url = None
    
    # URL für Default Cards finden
    for data in bulk_data.get("data", []):
        if data.get("type") == "default_cards":
            default_cards_url = data.get("download_uri")
            break
    
    if not default_cards_url:
        logger.error("Keine Bulk Data URL für Default Cards gefunden")
        return None
    
    return default_cards_url

def sync_cards_bulk(db: Session):
    """Karten über die Bulk Data API synchronisieren"""
    logger.info("Synchronisiere Karten über Bulk Data...")
    
    # Bulk Data URL abrufen
    bulk_data_url = get_bulk_data_url()
    logger.info(f"Lade Bulk Data von {bulk_data_url}")
    
    # Bulk Data herunterladen
    response = requests.get(bulk_data_url)
    cards_data = response.json()
    
    # Zuerst alle Farben einmalig erstellen
    logger.info("Erstelle Farbdefinitionen...")
    color_mapping = {
        "W": "White",
        "U": "Blue",
        "B": "Black",
        "R": "Red",
        "G": "Green"
    }
    
    # Prüfe, ob die Farben bereits existieren, sonst erstelle sie
    for color_code, color_name in color_mapping.items():
        db_color = db.query(Color).filter(Color.code == color_code).first()
        if not db_color:
            db_color = Color(code=color_code, name=color_name)
            db.add(db_color)
    
    # Speichere die Farben in der Datenbank
    db.commit()
    logger.info("Farbdefinitionen erstellt")
    
    # Karten verarbeiten - Begrenzung auf 100 Karten zum Testen
    cards_data = cards_data[:100]  # Nur die ersten 100 Karten verwenden
    total_cards = len(cards_data)
    batch_size = 50  # Karten pro Batch
    logger.info(f"Verarbeite {total_cards} Karten in Batches von {batch_size} (Testmodus)")
    
    for i in range(0, total_cards, batch_size):
        batch = cards_data[i:i+batch_size]
        logger.info(f"Verarbeite Batch {i//batch_size + 1}/{(total_cards + batch_size - 1)//batch_size}")
        
        for card_data in batch:
            # Nur relevante Felder extrahieren
            if card_data.get("layout") in ["token", "emblem", "art_series"]:
                continue  # Token und Embleme überspringen
                
            # Nur Karten mit Bildern verwenden
            if not card_data.get("image_uris"):
                continue
                
            card_info = {
                "id": card_data.get("id"),
                "name": card_data.get("name"),
                "mana_cost": card_data.get("mana_cost"),
                "cmc": card_data.get("cmc"),
                "type": card_data.get("type_line"),
                "rarity": card_data.get("rarity"),
                "text": card_data.get("oracle_text"),
                "set_code": card_data.get("set"),
                "set_name": card_data.get("set_name"),
                "image_url": card_data.get("image_uris", {}).get("normal"),
                "image_url_small": card_data.get("image_uris", {}).get("small")
            }
            
            # Karte in der Datenbank suchen oder erstellen
            db_card = db.query(Card).filter(Card.id == card_info["id"]).first()
            if db_card:
                # Karte aktualisieren
                for key, value in card_info.items():
                    setattr(db_card, key, value)
            else:
                # Neue Karte erstellen
                db_card = Card(**card_info)
                db.add(db_card)
            
            # Bestehende Farben entfernen
            db_card.colors = []
            
            # Farben hinzufügen (falls vorhanden)
            for color_code in card_data.get("colors", []):
                # Farbe aus der Datenbank abrufen (sollte bereits existieren)
                db_color = db.query(Color).filter(Color.code == color_code).first()
                if db_color:
                    # Farbe zur Karte hinzufügen
                    db_card.colors.append(db_color)
        
        # Änderungen speichern
        db.commit()
        logger.info(f"Batch {i//batch_size + 1} verarbeitet")
    
    logger.info("Karten synchronisiert")

def sync_database():
    """Hauptfunktion zum Synchronisieren der Datenbank mit der Scryfall-API"""
    start_time = datetime.now()
    logger.info(f"Starte Synchronisierung um {start_time}")
    
    # Datenbankverbindung herstellen
    db = SessionLocal()
    
    try:
        # Tabellen erstellen, falls sie nicht existieren
        Base.metadata.create_all(bind=engine)
        
        # Sets synchronisieren
        sync_sets(db)
        
        # Karten synchronisieren
        sync_cards_bulk(db)
        
        end_time = datetime.now()
        duration = (end_time - start_time).total_seconds()
        
        # Speichere den Zeitpunkt der letzten Synchronisierung
        with open("last_sync.txt", "w") as f:
            f.write(end_time.isoformat())
        
        logger.info(f"Synchronisierung abgeschlossen in {duration:.2f} Sekunden")
        print(f"Synchronisierung abgeschlossen in {duration:.2f} Sekunden!")
    except Exception as e:
        logger.error(f"Fehler bei der Synchronisierung: {str(e)}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    sync_database()
