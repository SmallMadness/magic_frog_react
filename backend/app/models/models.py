from sqlalchemy import Column, String, Integer, Float, ForeignKey, Table, Text, Boolean, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

from app.db.database import Base

# Viele-zu-viele Beziehungstabelle für Karten und Farben
card_colors = Table(
    "card_colors",
    Base.metadata,
    Column("card_id", String, ForeignKey("cards.id"), primary_key=True),
    Column("color_code", String, ForeignKey("colors.code"), primary_key=True)
)

class Card(Base):
    """
    Modell für Magic-Karten
    """
    __tablename__ = "cards"

    # Basis-Informationen
    id = Column(String, primary_key=True)  # Scryfall ID
    name = Column(String, nullable=False, index=True)
    mana_cost = Column(String)
    cmc = Column(Float)  # Converted Mana Cost als Float für Filterung
    type = Column(String, index=True)
    rarity = Column(String, index=True)
    text = Column(Text)
    
    # Set-Informationen
    set_code = Column(String, ForeignKey("sets.code"))
    set_name = Column(String, index=True)
    
    # Bild-URLs
    image_url = Column(String)
    image_url_small = Column(String)
    
    # Beziehungen
    set = relationship("Set", back_populates="cards")
    colors = relationship("Color", secondary=card_colors, backref="cards")

class Set(Base):
    """
    Modell für Magic-Sets
    """
    __tablename__ = "sets"

    code = Column(String, primary_key=True)
    name = Column(String, nullable=False, index=True)
    release_date = Column(String)
    set_type = Column(String)
    card_count = Column(Integer)
    icon_url = Column(String)
    
    # Beziehungen
    cards = relationship("Card", back_populates="set")

class Color(Base):
    """
    Modell für Magic-Farben
    """
    __tablename__ = "colors"

    code = Column(String, primary_key=True)  # W, U, B, R, G
    name = Column(String, nullable=False)    # White, Blue, Black, Red, Green


class DeckCard(Base):
    """
    Verbindungstabelle zwischen Decks und Karten mit Anzahl
    """
    __tablename__ = "deck_cards"

    id = Column(Integer, primary_key=True, autoincrement=True)
    deck_id = Column(Integer, ForeignKey("decks.id"), nullable=False)
    card_id = Column(String, ForeignKey("cards.id"), nullable=False)
    quantity = Column(Integer, default=1)
    is_sideboard = Column(Boolean, default=False)

    # Beziehungen
    card = relationship("Card")
    deck = relationship("Deck", back_populates="deck_cards")


class Deck(Base):
    """
    Modell für Magic-Decks
    """
    __tablename__ = "decks"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    format = Column(String, default="Standard")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Beziehungen
    deck_cards = relationship("DeckCard", back_populates="deck", cascade="all, delete-orphan")
