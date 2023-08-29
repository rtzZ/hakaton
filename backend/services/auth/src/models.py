import uuid

from common.app_utils.models import Base, BaseModel
from sqlalchemy import (
    UUID,
    Column,
    ForeignKey,
    String,
)
from sqlalchemy.orm import relationship

"""
Ролевая модель
Таблицы пользвателя и роли
"""


class UserRole(Base):
    __tablename__ = "user_roles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        "user_id",
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
    )
    role_id = Column(
        "role_id",
        UUID(as_uuid=True),
        ForeignKey("roles.id", ondelete="CASCADE"),
    )


class User(BaseModel):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String, nullable=True)
    password = Column(String, nullable=True)
    roles = relationship(
        "Role",
        secondary="user_roles",
        back_populates="users",
        lazy="selectin",
        cascade="all,delete",
    )


class Role(BaseModel):
    __tablename__ = "roles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    role = Column(String, nullable=True)
    users = relationship(
        "User", secondary="user_roles", back_populates="roles"
    )
