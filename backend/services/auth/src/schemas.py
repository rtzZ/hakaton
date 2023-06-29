from pydantic import BaseModel


class UserCreate(BaseModel):
    """Проверяет sign-up запрос"""

    username: str
    password: str
    roles: str


class UserBase(BaseModel):
    """Формирует тело ответа с деталями пользователя"""

    username: str


class UserCheck(BaseModel):
    """Проверяет sign-in запрос"""

    token: str = ""
    password: str = ""
    login: str = ""
    auth_type: str = ""
    app_role: str = ""
    role: str = ""


class User(UserBase):
    """Формирует тело ответа с деталями пользователя и токеном"""

    token: str = None
