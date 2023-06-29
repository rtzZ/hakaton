from pydantic import BaseModel


class UserCheck(BaseModel):
    """Проверяет sign-in запрос"""

    token: str = ""
    password: str = ""
    login: str = ""
    auth_type: str = ""
    app_role: str = ""
    role: str = ""


class BuildingSchema(BaseModel):
    name: str
