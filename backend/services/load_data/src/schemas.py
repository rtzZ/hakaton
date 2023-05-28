from pydantic import BaseModel, EmailStr

from typing import Optional
from pydantic import UUID4, BaseModel, EmailStr, Field, validator
from pydantic.validators import datetime


class UserCheck(BaseModel):
    """  Проверяет sign-in запрос """
    token: str = ''
    password: str = ''
    login: str = ''
    auth_type: str = ''
    app_role: str = ''
    role: str = ''

class BuildingSchema(BaseModel):
    name: str


