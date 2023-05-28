from fastapi import Query
from pydantic import BaseModel, EmailStr

from typing import Optional
from pydantic import UUID4, BaseModel, EmailStr, Field, validator
from pydantic.validators import datetime


class UserCreate(BaseModel):
    """ Проверяет sign-up запрос """
    username: str
    password: str
    roles: str


class UserBase(BaseModel):
    """ Формирует тело ответа с деталями пользователя """
    username: str

class UserCheck(BaseModel):
    """  Проверяет sign-in запрос """
    token: str = ''
    password: str = ''
    login: str = ''
    auth_type: str = ''
    app_role: str = ''
    role: str = ''

class TokenBase(BaseModel):
    token: UUID4 = Field(..., alias="access_token")
    expires: datetime
    token_type: Optional[str] = "bearer"

    class Config:
        allow_population_by_field_name = True

    @validator("token")
    def hexlify_token(cls, value):
        """ Конвертирует UUID в hex строку """
        return value.hex


class User(UserBase):
    """ Формирует тело ответа с деталями пользователя и токеном """
    token: TokenBase = {}