from pydantic import BaseModel
from typing import Optional


class BoothOut(BaseModel):
    id: str
    name: str
    location: Optional[str] = None
