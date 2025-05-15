from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.database import SessionLocal
from app.models.models import Set as SetModel
from app.schemas.schemas import Set

router = APIRouter(
    prefix="/sets",
    tags=["sets"],
    responses={404: {"description": "Not found"}},
)

# Dependency für Datenbank-Sessions
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[Set])
def get_sets(db: Session = Depends(get_db)):
    """
    Alle verfügbaren Sets abrufen
    """
    return db.query(SetModel).all()

@router.get("/{set_code}", response_model=Set)
def get_set(set_code: str, db: Session = Depends(get_db)):
    """
    Einzelnes Set anhand des Codes abrufen
    """
    set_obj = db.query(SetModel).filter(SetModel.code == set_code).first()
    if set_obj is None:
        raise HTTPException(status_code=404, detail="Set nicht gefunden")
    return set_obj
