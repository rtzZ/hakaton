from typing import Annotated, List, Optional
from fastapi import APIRouter, Depends, Query, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from app_utils.auth import Authorization, ServiceSender
from settings.database import get_session
from src.utils import learning_model, get_column_names
from zipfile import ZipFile

router = APIRouter()


@router.get("/learning_fields", status_code=200, dependencies=[Depends(Authorization(role='admin'))])
async def fetch_learning_fields(session: AsyncSession = Depends(get_session)) -> list:
    """ Получить данные о моделях """
    fields = await get_column_names(session=session)
    return fields


@router.post("/learning_fields", status_code=200)
async def pass_learning_fields(fields: Annotated[list[str], Query()],
                               model_name: str,
                               auth: ServiceSender = Depends(Authorization(role='admin')),
                               session: AsyncSession = Depends(get_session)) -> dict:
    """ Получить объекты с реккомендациями """
    is_learning = await learning_model(fields=fields, model_name=model_name, username=auth.username, session=session)
    return {'education': is_learning}



