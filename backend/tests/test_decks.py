import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.db.database import Base, get_db
from app.models.models import Card, Deck, DeckCard
from main import app

# Test-Datenbank-URL
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

# Test-Datenbank-Engine erstellen
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Test-Datenbank-Tabellen erstellen
Base.metadata.create_all(bind=engine)

# Test-Client erstellen
client = TestClient(app)

# Test-Datenbank-Session überschreiben
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

# Testdaten
test_card = {
    "id": "test-card-1",
    "name": "Test Card",
    "mana_cost": "{1}{R}",
    "cmc": 2.0,
    "type": "Creature — Test",
    "rarity": "Rare",
    "text": "This is a test card.",
    "set_code": "TST",
    "set_name": "Test Set",
    "image_url": "https://example.com/test-card.jpg",
    "image_url_small": "https://example.com/test-card-small.jpg"
}

test_deck = {
    "name": "Test Deck",
    "description": "This is a test deck",
    "format": "Standard",
    "cards": [
        {
            "card_id": "test-card-1",
            "quantity": 4,
            "is_sideboard": False
        }
    ]
}

# Fixture zum Erstellen von Testdaten
@pytest.fixture
def create_test_data():
    db = TestingSessionLocal()
    
    # Testdaten löschen
    db.query(DeckCard).delete()
    db.query(Deck).delete()
    db.query(Card).delete()
    
    # Testkarte erstellen
    db_card = Card(**test_card)
    db.add(db_card)
    db.commit()
    
    # Session schließen
    db.close()

# Tests
def test_create_deck(create_test_data):
    """Test zum Erstellen eines Decks"""
    response = client.post("/decks/", json=test_deck)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == test_deck["name"]
    assert data["description"] == test_deck["description"]
    assert data["format"] == test_deck["format"]
    
    # Deck-ID speichern für weitere Tests
    deck_id = data["id"]
    
    # Deck abrufen
    response = client.get(f"/decks/{deck_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == test_deck["name"]
    
    # Alle Decks abrufen
    response = client.get("/decks/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    
    # Deck aktualisieren
    update_data = {
        "name": "Updated Test Deck",
        "description": "This is an updated test deck"
    }
    response = client.put(f"/decks/{deck_id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == update_data["name"]
    assert data["description"] == update_data["description"]
    
    # Karte zum Deck hinzufügen
    response = client.post(f"/decks/{deck_id}/cards/{test_card['id']}?quantity=2&is_sideboard=true")
    assert response.status_code == 200
    
    # Karte aus dem Deck entfernen
    response = client.delete(f"/decks/{deck_id}/cards/{test_card['id']}?is_sideboard=true")
    assert response.status_code == 200
    
    # Deck löschen
    response = client.delete(f"/decks/{deck_id}")
    assert response.status_code == 204
    
    # Überprüfen, ob das Deck gelöscht wurde
    response = client.get(f"/decks/{deck_id}")
    assert response.status_code == 404
