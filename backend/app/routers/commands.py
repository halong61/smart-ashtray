from fastapi import APIRouter

router = APIRouter(prefix="/api/booths", tags=["commands"])

@router.post("/{booth_id}/command/spray")
def spray(booth_id: str):
    return {"booth_id": booth_id, "status": "queued"}
