from typing import List

from sqlalchemy import Column, Integer, String, Boolean, BigInteger, ForeignKey, DateTime, Float, UUID, func, ARRAY
import uuid

from sqlalchemy.dialects import postgresql
from sqlalchemy.orm import relationship

from app_utils.models import BaseModel


class LearningModel(BaseModel):
    """ Данные о модели (metamodel) """

    __tablename__ = "learning_model"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=True)
    username = Column(String, nullable=True)
    facts = Column(String, nullable=True)
    is_selected = Column(Boolean, nullable=True, default=False)
    created = Column(DateTime(timezone=True), server_default=func.now())
