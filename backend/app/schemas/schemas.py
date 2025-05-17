from typing import List, Optional, Dict
from pydantic import BaseModel
from datetime import datetime

class ColorBase(BaseModel):
    code: str
    name: str

class Color(ColorBase):
    class Config:
        orm_mode = True

class SetBase(BaseModel):
    code: str
    name: str
    release_date: Optional[str] = None
    set_type: Optional[str] = None
    card_count: Optional[int] = None
    icon_url: Optional[str] = None

class Set(SetBase):
    class Config:
        orm_mode = True

class CardBase(BaseModel):
    id: str
    name: str
    mana_cost: Optional[str] = None
    cmc: Optional[float] = None
    type: str
    rarity: str
    text: Optional[str] = None
    set_code: str
    set_name: str
    image_url: Optional[str] = None
    image_url_small: Optional[str] = None

class Card(CardBase):
    set: Optional[Set] = None
    colors: Optional[List[Color]] = None

    class Config:
        orm_mode = True


class DeckCardBase(BaseModel):
    card_id: str
    quantity: int = 1
    is_sideboard: bool = False


class DeckCardCreate(DeckCardBase):
    pass


class DeckCard(DeckCardBase):
    id: int
    deck_id: int
    card: Optional[Card] = None

    class Config:
        orm_mode = True


class DeckBase(BaseModel):
    name: str
    description: Optional[str] = None
    format: str = "Standard"


class DeckCreate(DeckBase):
    cards: List[DeckCardCreate] = []


class DeckUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    format: Optional[str] = None
    cards: Optional[List[DeckCardCreate]] = None


class Deck(DeckBase):
    id: int
    created_at: datetime
    updated_at: datetime
    deck_cards: List[DeckCard] = []

    class Config:
        orm_mode = True


class DeckWithCards(Deck):
    # Hilfsmethode zum Gruppieren von Karten in Hauptdeck und Sideboard
    @property
    def main_deck(self) -> List[Dict]:
        return [{
            "card": card.card,
            "quantity": card.quantity
        } for card in self.deck_cards if not card.is_sideboard]

    @property
    def sideboard(self) -> List[Dict]:
        return [{
            "card": card.card,
            "quantity": card.quantity
        } for card in self.deck_cards if card.is_sideboard]
