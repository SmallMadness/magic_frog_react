from typing import List, Optional
from pydantic import BaseModel

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
