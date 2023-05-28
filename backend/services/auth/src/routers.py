from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBasic, HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import JSONResponse
from settings.database import get_session
from src.schemas import UserCreate
from src.utils import create_user, check_user, check_token, check_role, create_token

users = APIRouter()

@users.post("/sign-up", status_code=201)
async def sign_up(user: UserCreate, session: AsyncSession = Depends(get_session)):
    user = await create_user(user=user, session=session)
    if user:
        return JSONResponse({'user': user.dict()})
    raise HTTPException(status_code=401, detail="This user already exists")

@users.post("/sign-in", status_code=200)
async def sign_in(app_role: str = None, token: bool = False, basic_auth: HTTPAuthorizationCredentials = Depends(HTTPBasic(auto_error=False)),
                  bearer_auth: HTTPAuthorizationCredentials = Depends(HTTPBearer(auto_error=False)),
                  session: AsyncSession = Depends(get_session)):
    access = False
    username = None
    if basic_auth:
        access, username = await check_user(credentials=basic_auth, session=session)
    elif bearer_auth:
        access, username = await check_token(credentials=bearer_auth)
    if access:
        access_role = await check_role(username=username, app_role=app_role, session=session)
        if access_role:
            return JSONResponse(dict(access=True, token=create_token(username), username=username) if token else dict(access=True, username=username))
    raise HTTPException(status_code=401, detail="Not authenticated")







