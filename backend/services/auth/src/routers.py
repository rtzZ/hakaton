from common.database import get_session
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import (
    HTTPAuthorizationCredentials,
    HTTPBasic,
    HTTPBearer,
)
from sqlalchemy.ext.asyncio import AsyncSession
from src.schemas import UserCreate
from src.utils import (
    check_role,
    check_token,
    check_user,
    create_token,
    create_user,
)
from starlette.responses import JSONResponse

router = APIRouter()


@router.post("/sign-up", status_code=201)
async def sign_up(
    user: UserCreate, session: AsyncSession = Depends(get_session)
):
    """Регистрация пользователя"""

    user = await create_user(user=user, session=session)
    if user:
        return JSONResponse({"user": user.dict()})
    raise HTTPException(status_code=401, detail="This user already exists")


@router.post("/sign-in", status_code=200)
async def sign_in(
    app_role: str = None,
    token: bool = False,
    basic_auth: HTTPAuthorizationCredentials = Depends(
        HTTPBasic(auto_error=False)
    ),
    bearer_auth: HTTPAuthorizationCredentials = Depends(
        HTTPBearer(auto_error=False)
    ),
    session: AsyncSession = Depends(get_session),
):
    """Авторизация пользователя"""
    access = False
    username = None
    if basic_auth:
        access, username = await check_user(
            credentials=basic_auth, session=session
        )
    elif bearer_auth:
        access, username = await check_token(credentials=bearer_auth)
    if access:
        access_role = await check_role(
            username=username, app_role=app_role, session=session
        )
        if access_role:
            return JSONResponse(
                dict(
                    access=True,
                    token=create_token(username),
                    username=username,
                )
                if token
                else dict(access=True, username=username)
            )
    raise HTTPException(status_code=401, detail="Not authenticated")
