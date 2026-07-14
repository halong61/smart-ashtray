from fastapi import APIRouter

router = APIRouter(prefix="/api/booths", tags=["booths"])


@router.get("")
def list_booths():
    return [
        {
            "id": "booth-1",
            "name": "1호 부스",
            "location": "1층 로비",
            "state": "IDLE",
            "aqi": 42,
            "water_level_percent": 78,
            "cigarette_load_percent": 35,
        },
        {
            "id": "booth-2",
            "name": "2호 부스",
            "location": "2층 휴게실",
            "state": "SMOKING",
            "aqi": 86,
            "water_level_percent": 22,
            "cigarette_load_percent": 81,
        },
    ]
