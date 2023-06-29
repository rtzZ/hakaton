import uuid

from common.app_utils.models import BaseModel
from sqlalchemy import (
    UUID,
    Boolean,
    Column,
    DateTime,
    String,
    func,
)


class LearningModel(BaseModel):
    """Данные о модели (metamodel)"""

    __tablename__ = "learning_model"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=True)
    username = Column(String, nullable=True)
    facts = Column(String, nullable=True)
    is_selected = Column(Boolean, nullable=True, default=False)
    created = Column(DateTime(timezone=True), server_default=func.now())
