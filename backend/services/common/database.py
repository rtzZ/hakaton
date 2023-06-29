from uuid import uuid4

from asyncpg import Connection
from common.config import DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER
from sqlalchemy import NullPool
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker


class CConnection(Connection):
    def _get_unique_id(self, prefix):
        return f"__asyncpg_{prefix}_{uuid4()}__"


connect_args = {
    "prepared_statement_cache_size": 0,
    "statement_cache_size": 0,
    "connection_class": CConnection,
}

DATABASE_URL = f"postgresql+asyncpg://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}?prepared_statement_cache_size=0"

database = create_async_engine(
    DATABASE_URL, poolclass=NullPool, future=True, connect_args=connect_args
)

async_session = sessionmaker(
    bind=database, class_=AsyncSession, expire_on_commit=False, autoflush=False
)


async def get_session() -> AsyncSession:
    """Асинхронные сессии"""
    async with async_session() as session:
        yield session
