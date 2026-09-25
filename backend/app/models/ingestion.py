from sqlalchemy import Column, Integer, String, DateTime, BigInteger
from app.db.base import Base
from sqlalchemy.sql import func


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    file_name = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_size = Column(BigInteger)
    status = Column(String, default="queued")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
