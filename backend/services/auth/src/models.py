from sqlalchemy import Column, Integer, String, Boolean, BigInteger, ForeignKey, DateTime, Float, UUID
import uuid

from sqlalchemy.orm import relationship

from app_utils.models import BaseModel, Base


class UserRole(Base):

    __tablename__ = "user_roles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column('user_id', UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'))
    role_id = Column('role_id', UUID(as_uuid=True), ForeignKey('roles.id', ondelete='CASCADE'))

class User(BaseModel):

    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String, nullable=True)
    password = Column(String, nullable=True)
    roles = relationship('Role', secondary='user_roles', back_populates='users', lazy='selectin', cascade='all,delete')
    # roles = relationship('Role', secondary='user_roles', back_populates='users', cascade='all,delete')

class Role(BaseModel):

    __tablename__ = "roles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    role = Column(String, nullable=True)
    users = relationship('User', secondary='user_roles', back_populates='roles')

