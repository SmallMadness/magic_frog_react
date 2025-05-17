from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.scripts.sync_cards import sync_database

router = APIRouter(
    prefix="/sync",
    tags=["sync"],
    responses={404: {"description": "Not found"}}
)

@router.post("/cards", status_code=status.HTTP_202_ACCEPTED)
async def sync_cards(background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """
    Synchronisiert die Karten-Datenbank mit der Scryfall-API.
    Diese Operation wird im Hintergrund ausgeführt.
    """
    # Synchronisierung im Hintergrund starten
    background_tasks.add_task(sync_database)
    
    return {"message": "Synchronisierung gestartet. Dies kann einige Minuten dauern."}

@router.get("/status")
async def sync_status():
    """
    Gibt den Status der letzten Synchronisierung zurück.
    """
    try:
        with open("last_sync.txt", "r") as f:
            last_sync = f.read().strip()
        return {"last_sync": last_sync}
    except FileNotFoundError:
        return {"last_sync": None}
