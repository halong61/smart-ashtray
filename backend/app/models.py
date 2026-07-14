from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declarative_base
import uuid

Base = declarative_base()


class Booth(Base):
    __tablename__ = "booths"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    location = Column(String, nullable=True)


class Telemetry(Base):
    __tablename__ = "telemetry"
    time = Column(DateTime(timezone=True), primary_key=True)
    booth_id = Column(UUID(as_uuid=True), ForeignKey("booths.id"), primary_key=True)
    aqi = Column(Float)
    temperature = Column(Float)
    humidity = Column(Float)
    water_level_percent = Column(Integer)
    cigarette_load_percent = Column(Integer)
    state = Column(String)
