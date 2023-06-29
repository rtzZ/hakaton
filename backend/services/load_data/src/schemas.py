from pydantic import BaseModel

""" Рыба файл для схем """


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
