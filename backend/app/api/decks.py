from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.models import Deck, DeckCard, Card
from app.schemas.schemas import Deck as DeckSchema
from app.schemas.schemas import DeckCreate, DeckUpdate, DeckWithCards

router = APIRouter(
    prefix="/decks",
    tags=["decks"],
    responses={404: {"description": "Deck nicht gefunden"}}
)

@router.get("/", response_model=List[DeckSchema])
def get_decks(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    """
    Alle Decks abrufen
    """
    decks = db.query(Deck).offset(skip).limit(limit).all()
    return decks

@router.get("/{deck_id}", response_model=DeckWithCards)
def get_deck(deck_id: int, db: Session = Depends(get_db)):
    """
    Ein einzelnes Deck mit allen Karten abrufen
    """
    deck = db.query(Deck).filter(Deck.id == deck_id).first()
    if deck is None:
        raise HTTPException(status_code=404, detail="Deck nicht gefunden")
    
    # Karten mit laden
    deck_cards = db.query(DeckCard).filter(DeckCard.deck_id == deck_id).all()
    for deck_card in deck_cards:
        deck_card.card = db.query(Card).filter(Card.id == deck_card.card_id).first()
    
    return deck

@router.post("/", response_model=DeckSchema, status_code=status.HTTP_201_CREATED)
def create_deck(deck: DeckCreate, db: Session = Depends(get_db)):
    """
    Neues Deck erstellen
    """
    # Deck-Objekt erstellen
    db_deck = Deck(
        name=deck.name,
        description=deck.description,
        format=deck.format
    )
    db.add(db_deck)
    db.commit()
    db.refresh(db_deck)
    
    # Karten zum Deck hinzufügen
    for card_item in deck.cards:
        # Überprüfen, ob die Karte existiert
        db_card = db.query(Card).filter(Card.id == card_item.card_id).first()
        if db_card is None:
            raise HTTPException(
                status_code=404,
                detail=f"Karte mit ID {card_item.card_id} nicht gefunden"
            )
        
        # Karte zum Deck hinzufügen
        db_deck_card = DeckCard(
            deck_id=db_deck.id,
            card_id=card_item.card_id,
            quantity=card_item.quantity,
            is_sideboard=card_item.is_sideboard
        )
        db.add(db_deck_card)
    
    db.commit()
    db.refresh(db_deck)
    return db_deck

@router.put("/{deck_id}", response_model=DeckSchema)
def update_deck(deck_id: int, deck: DeckUpdate, db: Session = Depends(get_db)):
    """
    Deck aktualisieren
    """
    db_deck = db.query(Deck).filter(Deck.id == deck_id).first()
    if db_deck is None:
        raise HTTPException(status_code=404, detail="Deck nicht gefunden")
    
    # Deck-Eigenschaften aktualisieren
    if deck.name is not None:
        db_deck.name = deck.name
    if deck.description is not None:
        db_deck.description = deck.description
    if deck.format is not None:
        db_deck.format = deck.format
    
    # Karten aktualisieren, falls vorhanden
    if deck.cards is not None:
        # Alle vorhandenen Karten entfernen
        db.query(DeckCard).filter(DeckCard.deck_id == deck_id).delete()
        
        # Neue Karten hinzufügen
        for card_item in deck.cards:
            # Überprüfen, ob die Karte existiert
            db_card = db.query(Card).filter(Card.id == card_item.card_id).first()
            if db_card is None:
                raise HTTPException(
                    status_code=404,
                    detail=f"Karte mit ID {card_item.card_id} nicht gefunden"
                )
            
            # Karte zum Deck hinzufügen
            db_deck_card = DeckCard(
                deck_id=db_deck.id,
                card_id=card_item.card_id,
                quantity=card_item.quantity,
                is_sideboard=card_item.is_sideboard
            )
            db.add(db_deck_card)
    
    db.commit()
    db.refresh(db_deck)
    return db_deck

@router.delete("/{deck_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_deck(deck_id: int, db: Session = Depends(get_db)):
    """
    Deck löschen
    """
    db_deck = db.query(Deck).filter(Deck.id == deck_id).first()
    if db_deck is None:
        raise HTTPException(status_code=404, detail="Deck nicht gefunden")
    
    # Deck löschen (cascade löscht auch alle DeckCards)
    db.delete(db_deck)
    db.commit()
    return None

@router.post("/{deck_id}/cards/{card_id}", response_model=DeckSchema)
def add_card_to_deck(
    deck_id: int, 
    card_id: str, 
    quantity: int = 1, 
    is_sideboard: bool = False, 
    db: Session = Depends(get_db)
):
    """
    Karte zum Deck hinzufügen oder Anzahl aktualisieren
    """
    # Überprüfen, ob das Deck existiert
    db_deck = db.query(Deck).filter(Deck.id == deck_id).first()
    if db_deck is None:
        raise HTTPException(status_code=404, detail="Deck nicht gefunden")
    
    # Überprüfen, ob die Karte existiert
    db_card = db.query(Card).filter(Card.id == card_id).first()
    if db_card is None:
        raise HTTPException(status_code=404, detail="Karte nicht gefunden")
    
    # Überprüfen, ob die Karte bereits im Deck ist
    db_deck_card = db.query(DeckCard).filter(
        DeckCard.deck_id == deck_id,
        DeckCard.card_id == card_id,
        DeckCard.is_sideboard == is_sideboard
    ).first()
    
    if db_deck_card:
        # Anzahl aktualisieren
        db_deck_card.quantity += quantity
    else:
        # Neue Karte zum Deck hinzufügen
        db_deck_card = DeckCard(
            deck_id=deck_id,
            card_id=card_id,
            quantity=quantity,
            is_sideboard=is_sideboard
        )
        db.add(db_deck_card)
    
    db.commit()
    db.refresh(db_deck)
    return db_deck

@router.delete("/{deck_id}/cards/{card_id}", response_model=DeckSchema)
def remove_card_from_deck(
    deck_id: int, 
    card_id: str, 
    is_sideboard: bool = False, 
    db: Session = Depends(get_db)
):
    """
    Karte aus dem Deck entfernen
    """
    # Überprüfen, ob das Deck existiert
    db_deck = db.query(Deck).filter(Deck.id == deck_id).first()
    if db_deck is None:
        raise HTTPException(status_code=404, detail="Deck nicht gefunden")
    
    # Überprüfen, ob die Karte im Deck ist
    db_deck_card = db.query(DeckCard).filter(
        DeckCard.deck_id == deck_id,
        DeckCard.card_id == card_id,
        DeckCard.is_sideboard == is_sideboard
    ).first()
    
    if db_deck_card is None:
        raise HTTPException(status_code=404, detail="Karte nicht im Deck gefunden")
    
    # Karte aus dem Deck entfernen
    db.delete(db_deck_card)
    db.commit()
    db.refresh(db_deck)
    return db_deck
