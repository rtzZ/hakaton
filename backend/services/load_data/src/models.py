import uuid

from common.app_utils.models import BaseModel
from sqlalchemy import (
    UUID,
    Boolean,
    Column,
    DateTime,
    Integer,
    String,
    func,
)


class Building(BaseModel):
    """Модель объекта"""

    __tablename__ = "object_flat"

    id = Column(Integer, primary_key=True, autoincrement=True)

    unom = Column(Integer, nullable=True)
    address = Column(String, nullable=True)
    d = Column(String, nullable=True)
    k = Column(String, nullable=True)
    s = Column(String, nullable=True)
    soor = Column(String, nullable=True)

    col_781 = Column(String, nullable=True)
    col_772 = Column(Integer, nullable=True)
    col_769 = Column(String, nullable=True)
    col_764 = Column(Integer, nullable=True)
    col_763 = Column(Integer, nullable=True)
    col_762 = Column(Integer, nullable=True)
    col_761 = Column(Integer, nullable=True)
    col_759 = Column(Integer, nullable=True)
    col_760 = Column(Integer, nullable=True)
    col_756 = Column(Integer, nullable=True)
    col_771 = Column(Integer, nullable=True)
    col_770 = Column(String, nullable=True)
    col_754 = Column(String, nullable=True)
    col_3243 = Column(Integer, nullable=True)
    col_3163 = Column(String, nullable=True)
    col_2463 = Column(String, nullable=True)


class Recommendation(BaseModel):
    """Модель типов работ"""

    __tablename__ = "work_type"

    id = Column(Integer, primary_key=True, autoincrement=True)
    code = Column(Integer, nullable=True)

    name = Column(String, nullable=True)
    name_common = Column(String, nullable=True)
    work_type = Column(String, nullable=True)
    work_group = Column(String, nullable=True)
    work_short_name = Column(String, nullable=True)


class LearningModel(BaseModel):
    """Модель обучения"""

    __tablename__ = "learning_model"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4())
    name = Column(String, unique=False)
    username = Column(String, nullable=True)
    facts = Column(String, nullable=True)
    is_selected = Column(Boolean, nullable=True, default=False)
    created = Column(DateTime(timezone=True), server_default=func.now())


class AddressPos(BaseModel):
    __tablename__ = "address"

    id = Column(Integer, primary_key=True, autoincrement=True)
    address = Column(String, nullable=True)
    soor = Column(String, nullable=True)


class Event(BaseModel):
    __tablename__ = "event"

    id = Column(Integer, primary_key=True, autoincrement=True)
    description = Column(String, nullable=True)


class Incident(BaseModel):
    __tablename__ = "stg_incident"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=True)
    source = Column(String, nullable=True)
    date_ext_created = Column(String, nullable=True)  # из внешней системе
    date_completed = Column(String, nullable=True)
    district = Column(String, nullable=True)
    address = Column(String, nullable=True)
    unom = Column(String, nullable=True)
    date_ext_completed = Column(
        String, nullable=True
    )  # дата завершения во внешней системе
