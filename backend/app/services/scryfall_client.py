import requests
import time
from sqlalchemy.orm import Session
from typing import Dict, List, Any, Optional

from app.models.models import Card, Set, Color

# Scryfall API Basis-URL
SCRYFALL_API_BASE = "https://api.scryfall.com"

def fetch_sets() -> List[Dict[str, Any]]:
    """
    Alle verfügbaren Sets von Scryfall abrufen
    """
    response = requests.get(f"{SCRYFALL_API_BASE}/sets")
    if response.status_code != 200:
        raise Exception(f"Fehler beim Abrufen der Sets: {response.status_code}")
    
    return response.json().get("data", [])

def fetch_cards_by_set(set_code: str) -> List[Dict[str, Any]]:
    """
    Alle Karten eines bestimmten Sets abrufen
    """
    cards = []
    has_more = True
    next_page = f"{SCRYFALL_API_BASE}/cards/search?q=set:{set_code}&unique=prints"
    
    while has_more:
        print(f"Fetching cards from {next_page}")
        response = requests.get(next_page)
        
        # Rate Limiting beachten (max. 10 Anfragen pro Sekunde)
        time.sleep(0.1)
        
        if response.status_code == 404:
            # Keine Karten gefunden
            return []
        
        if response.status_code != 200:
            raise Exception(f"Fehler beim Abrufen der Karten: {response.status_code}")
        
        data = response.json()
        cards.extend(data.get("data", []))
        
        has_more = data.get("has_more", False)
        next_page = data.get("next_page", "")
    
    return cards

def map_card_data(card_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Kartendaten von Scryfall in unser Format mappen
    """
    return {
        "id": card_data.get("id"),
        "name": card_data.get("name"),
        "mana_cost": card_data.get("mana_cost", ""),
        "cmc": card_data.get("cmc", 0.0),
        "type": card_data.get("type_line", ""),
        "rarity": card_data.get("rarity", "").capitalize(),
        "text": card_data.get("oracle_text", ""),
        "set_code": card_data.get("set"),
        "set_name": card_data.get("set_name", ""),
        "image_url": card_data.get("image_uris", {}).get("normal", ""),
        "image_url_small": card_data.get("image_uris", {}).get("small", ""),
    }

def map_set_data(set_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Set-Daten von Scryfall in unser Format mappen
    """
    return {
        "code": set_data.get("code"),
        "name": set_data.get("name"),
        "release_date": set_data.get("released_at"),
        "set_type": set_data.get("set_type"),
        "card_count": set_data.get("card_count", 0),
        "icon_url": set_data.get("icon_svg_uri", ""),
    }

def update_card_database(db: Session, limit_sets: Optional[int] = None) -> Dict[str, int]:
    """
    Datenbank mit Karten von Scryfall aktualisieren
    
    Args:
        db: Datenbank-Session
        limit_sets: Optional, Anzahl der Sets zu importieren (für Tests)
    
    Returns:
        Dict mit Statistiken: {"added": int, "updated": int}
    """
    stats = {"added": 0, "updated": 0}
    
    # Farben initialisieren, falls sie noch nicht existieren
    colors = [
        {"code": "W", "name": "White"},
        {"code": "U", "name": "Blue"},
        {"code": "B", "name": "Black"},
        {"code": "R", "name": "Red"},
        {"code": "G", "name": "Green"},
    ]
    
    for color_data in colors:
        color = db.query(Color).filter_by(code=color_data["code"]).first()
        if not color:
            color = Color(**color_data)
            db.add(color)
    
    db.commit()
    
    # Sets abrufen und speichern
    sets_data = fetch_sets()
    
    # Optional: Nur eine begrenzte Anzahl von Sets für Tests
    if limit_sets:
        sets_data = sets_data[:limit_sets]
    
    for set_data in sets_data:
        mapped_set = map_set_data(set_data)
        
        # Set in der Datenbank suchen oder erstellen
        db_set = db.query(Set).filter_by(code=mapped_set["code"]).first()
        
        if not db_set:
            db_set = Set(**mapped_set)
            db.add(db_set)
        else:
            # Set aktualisieren
            for key, value in mapped_set.items():
                setattr(db_set, key, value)
        
        db.commit()
        
        # Karten für dieses Set abrufen
        try:
            cards_data = fetch_cards_by_set(mapped_set["code"])
            
            for card_data in cards_data:
                try:
                    mapped_card = map_card_data(card_data)
                    
                    # Karte in der Datenbank suchen oder erstellen
                    db_card = db.query(Card).filter_by(id=mapped_card["id"]).first()
                    
                    if not db_card:
                        db_card = Card(**mapped_card)
                        db.add(db_card)
                        stats["added"] += 1
                    else:
                        # Karte aktualisieren
                        for key, value in mapped_card.items():
                            setattr(db_card, key, value)
                        stats["updated"] += 1
                    
                    # Farben der Karte aktualisieren
                    db_card.colors = []
                    card_colors = card_data.get("colors", [])
                    
                    for color_code in card_colors:
                        color = db.query(Color).filter_by(code=color_code).first()
                        if color:
                            db_card.colors.append(color)
                    
                    db.commit()
                    
                except Exception as e:
                    print(f"Fehler beim Verarbeiten der Karte {card_data.get('name')}: {str(e)}")
                    db.rollback()
            
        except Exception as e:
            print(f"Fehler beim Abrufen der Karten für Set {mapped_set['name']}: {str(e)}")
    
    return stats
