from sqlalchemy import Column, Integer, String, Boolean, BigInteger, ForeignKey, DateTime, Float, UUID, func, ARRAY
import uuid

from sqlalchemy.orm import relationship

from app_utils.models import BaseModel, Base

# # Материалы кровли по БТИ
# class col_781(BaseModel):
#
#     __tablename__ = "col_781"
#
#     id = Column(Integer, primary_key=True, autoincrement=True)
#     name = Column(String, nullable=True)
#
# # Очередность уборки кровли
# class col_775(BaseModel):
#
#     __tablename__ = "col_775"
#
#     id = Column(Integer, primary_key=True, autoincrement=True)
#     name = Column(String, nullable=True)
#
# # Признак аварийности здания
# class col_770(BaseModel):
#
#     __tablename__ = "col_770"
#
#     id = Column(Integer, primary_key=True, autoincrement=True)
#     name = Column(String, nullable=True)
#
# # Материалы стен (раскрытие)
# class col_769(BaseModel):
#
#     __tablename__ = "col_769"
#
#     id = Column(Integer, primary_key=True, autoincrement=True)
#     name = Column(String, nullable=True)
#
# # Серии проектов
# class col_758(BaseModel):
#
#     __tablename__ = "col_758"
#
#     id = Column(Integer, primary_key=True, autoincrement=True)
#     name = Column(String, nullable=True)
#
# # Статусы управления МКД
# class col_3243(BaseModel):
#
#     __tablename__ = "col_3243"
#
#     id = Column(Integer, primary_key=True, autoincrement=True)
#     name = Column(String, nullable=True)
#
# # Статусы МКД
# class col_3163(BaseModel):
#
#     __tablename__ = "col_3163"
#
#     id = Column(Integer, primary_key=True, autoincrement=True)
#     name = Column(String, nullable=True)
#
# # Типы жилищного фонда
# class col_2463(BaseModel):
#
#     __tablename__ = "col_2463"
#
#     id = Column(Integer, primary_key=True, autoincrement=True)
#     name = Column(String, nullable=True)
#
# # Виды социальных объектов
# class col_2156(BaseModel):
#
#     __tablename__ = "col_2156"
#
#     id = Column(Integer, primary_key=True, autoincrement=True)
#     name = Column(String, nullable=True)
#
# # Категория МКД
# class col_103506(BaseModel):
#
#     __tablename__ = "col_103506"
#
#     id = Column(Integer, primary_key=True, autoincrement=True)
#     name = Column(String, nullable=True)


class Building(BaseModel):

    __tablename__ = "object_flat"

    id = Column(Integer, primary_key=True, autoincrement=True)

    unom = Column(Integer, nullable=True)
    address = Column(String, nullable=True)
    d = Column(String, nullable=True)
    k = Column(String, nullable=True)
    s = Column(String, nullable=True)

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

    # col_771 = Column(Integer, nullable=True)
    # col_759 = Column(Integer, nullable=True)
    # col_760 = Column(Integer, nullable=True)
    # col_761 = Column(Integer, nullable=True)
    #
    # col_766 = Column(Integer, nullable=True)
    # col_765 = Column(Integer, nullable=True)
    # col_764 = Column(Integer, nullable=True)
    # col_763 = Column(Integer, nullable=True)
    # col_762 = Column(Integer, nullable=True)
    # col_757 = Column(Integer, nullable=True)
    # col_756 = Column(Integer, nullable=True)
    # col_755 = Column(String, nullable=True)
    # col_754 = Column(String, nullable=True)
    # col_3468 = Column(String, nullable=True)
    # col_3363 = Column(Integer, nullable=True)

    # # col_758 = relationship("col_758", backref="building", uselist=True, lazy='selectin')
    # col_758_id = Column('col_758_id', String, ForeignKey('col_758.id'))
    # col_758 = relationship("col_758", backref="building", lazy='selectin')
    #
    # col_770_id = Column('col_770_id', String, ForeignKey('col_770.id'))
    # col_770 = relationship("col_770", backref="building", lazy='selectin')
    #
    # col_769_id = Column('col_769_id', String, ForeignKey('col_769.id'))
    # col_769 = relationship("col_769", backref="building", lazy='selectin')
    #
    # col_781_id = Column('col_781_id', String, ForeignKey('col_781.id'))
    # col_781 = relationship("col_781", backref="building", lazy='selectin')
    #
    # col_775_id = Column('col_775_id', String, ForeignKey('col_775.id'))
    # col_775 = relationship("col_775", backref="building", lazy='selectin')
    #
    # col_3243_id = Column('col_3243_id', String, ForeignKey('col_3243.id'))
    # col_3243 = relationship("col_3243", backref="building", lazy='selectin')
    #
    # col_3163_id = Column('col_3163_id', String, ForeignKey('col_3163.id'))
    # col_3163 = relationship("col_3163", backref="building", lazy='selectin')
    #
    # col_2463_id = Column('col_2463_id', String, ForeignKey('col_2463.id'))
    # col_2463 = relationship("col_2463", backref="building", lazy='selectin')
    #
    # col_2156_id = Column('col_2156_id', Integer, ForeignKey('col_2156.id'))
    # col_2156 = relationship("col_2156", backref="building", lazy='selectin')
    #
    # col_103506_id = Column('col_103506_id', String, ForeignKey('col_103506.id'))
    # col_103506 = relationship("col_103506", backref="building", lazy='selectin')


class Recommendation(BaseModel):

    __tablename__ = "work_type"

    id = Column(Integer, primary_key=True, autoincrement=True)
    code = Column(Integer, nullable=True)

    name = Column(String, nullable=True)
    name_common = Column(String, nullable=True)
    work_type = Column(String, nullable=True)
    work_group = Column(String, nullable=True)
    work_short_name = Column(String, nullable=True)


class LearningModel(BaseModel):

    __tablename__ = "learning_model"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4())
    name = Column(String, unique=False)
    username = Column(String, nullable=True)
    facts = Column(String, nullable=True)
    is_selected = Column(Boolean, nullable=True, default=False)
    created = Column(DateTime(timezone=True), server_default=func.now())