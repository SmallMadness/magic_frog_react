from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from app.db.database import SessionLocal
from app.models.models import Card as CardModel
from app.schemas.schemas import Card
from app.services.scryfall_client import update_card_database

router = APIRouter(
    prefix="/cards",
    tags=["cards"],
    responses={404: {"description": "Not found"}},
)

# Dependency für Datenbank-Sessions
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[Card])
def get_cards(
    name: Optional[str] = None,
    card_type: Optional[str] = None,
    rarity: Optional[str] = None,
    set_name: Optional[str] = None,
    mana_cost: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Karten mit optionalen Filtern abrufen
    """
    cards = db.query(CardModel)
    
    # Filter anwenden
    if name:
        cards = cards.filter(CardModel.name.ilike(f"%{name}%"))
    if card_type:
        cards = cards.filter(CardModel.type.ilike(f"%{card_type}%"))
    if rarity:
        cards = cards.filter(CardModel.rarity == rarity)
    if set_name:
        cards = cards.filter(CardModel.set_name == set_name)
    if mana_cost is not None:
        if mana_cost >= 5:
            cards = cards.filter(CardModel.cmc >= 5)
        else:
            cards = cards.filter(CardModel.cmc == mana_cost)
    
    return cards.offset(skip).limit(limit).all()

@router.get("/{card_id}", response_model=Card)
def get_card(card_id: str, db: Session = Depends(get_db)):
    """
    Einzelne Karte anhand der ID abrufen
    """
    card = db.query(CardModel).filter(CardModel.id == card_id).first()
    if card is None:
        raise HTTPException(status_code=404, detail="Karte nicht gefunden")
    return card

@router.post("/update-database/")
def update_database(db: Session = Depends(get_db)):
    """
    Datenbank mit aktuellen Karten von Scryfall aktualisieren
    """
    try:
        result = update_card_database(db)
        return {"message": f"Datenbank erfolgreich aktualisiert. {result['added']} Karten hinzugefügt, {result['updated']} aktualisiert."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Fehler beim Aktualisieren der Datenbank: {str(e)}")
