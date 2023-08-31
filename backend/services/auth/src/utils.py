import hashlib
import random
import string
from datetime import datetime, timedelta
import traceback

import jwt
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from src.models import Role, User
from src.schemas import UserBase, UserCreate


async def create_user(user: UserCreate, session: AsyncSession):
    """Создает пользователя"""
    query = select(User).where(user.username == User.username)
    user_ = (await session.execute(query)).scalars().all()
    if not user_:
        roles = user.roles.replace(" ", "").split(",")
        query = select(Role).filter(Role.role.in_(roles))
        roles = (await session.execute(query)).scalars().all()
        salt = get_random_string()
        hashed_password = hash_password(user.password, salt)
        new_user = User(
            username=user.username, password=f"{salt}${hashed_password}"
        )
        new_user.roles = roles
        session.add(new_user)
        await session.commit()
        return UserBase(username=new_user.username)


async def check_user(
    credentials: HTTPAuthorizationCredentials, session: AsyncSession
) -> tuple:
    """Проверяет пользователя Basic auth"""
    access = False
    query = select(User).where(credentials.username == User.username)
    user_ = (await session.execute(query)).scalars().all()
    if user_:
        access = validate_password(credentials.password, user_[0].password)
        return access, credentials.username
    return access, None


async def check_token(credentials: HTTPAuthorizationCredentials) -> tuple:
    """Проверяет пользователя JwtToken auth"""
    access = False
    try:
        payload = jwt.decode(
            credentials.credentials, "SECRET_STRING1", algorithms=["HS256"]
        )
        access = int(datetime.utcnow().timestamp()) < int(payload["exp"])
        return access, payload["username"]
    except Exception as e:
        print("Error")
        print(e)
        print(traceback.format_exc())
        return access, None


async def check_role(username: str, app_role: str, session: AsyncSession):
    """Проверяет роль пользователя"""
    query = select(User).filter(username == User.username)
    user = (await session.execute(query)).scalars().one()
    if user:
        roles = [role.role for role in user.roles]
        if app_role:
            return app_role in roles
    return True


def validate_password(password: str, hashed_password: str):
    """Проверяет пароль"""
    salt, hashed = hashed_password.split("$")
    return hash_password(password, salt) == hashed


def hash_password(password: str, salt: str = None):
    """Хэширует пароль с солью"""
    if salt is None:
        salt = get_random_string()
    enc = hashlib.pbkdf2_hmac(
        "sha256", password.encode(), salt.encode(), 100_000
    )
    return enc.hex()


def get_random_string(length=12):
    """Рандомная строка соль"""
    return "".join(random.choice(string.ascii_letters) for _ in range(length))


def create_token(username: str):
    """Создает JwtToken"""
    jwt_token = jwt.encode(
        dict(exp=datetime.utcnow() + timedelta(days=14), username=username),
        "SECRET_STRING1",
    )
    return jwt_token
