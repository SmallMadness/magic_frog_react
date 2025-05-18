from typing import List, Optional, Dict, Union
from pydantic import BaseModel, EmailStr, Field, validator
from datetime import datetime
from app.models.models import UserRole

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


# Benutzer-Schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr


class UserCreate(UserBase):
    password: str = Field(..., min_length=8)
    password_confirm: str
    
    @validator('password_confirm')
    def passwords_match(cls, v, values):
        if 'password' in values and v != values['password']:
            raise ValueError('Passwörter stimmen nicht überein')
        return v


class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = None
    role: Optional[UserRole] = None


class UserLogin(BaseModel):
    username: str
    password: str


class User(UserBase):
    id: int
    role: UserRole
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class UserInDB(User):
    hashed_password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[UserRole] = None
