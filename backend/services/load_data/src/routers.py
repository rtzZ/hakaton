from dataclasses import Field
from io import BytesIO
from typing import Annotated, List, Optional

import pandas
from fastapi import APIRouter, Depends, Query
from fastapi.security import HTTPAuthorizationCredentials
from fastapi_filter import FilterDepends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.requests import Request
from starlette.responses import JSONResponse, FileResponse, StreamingResponse
from app_utils.auth import Authorization
from settings.database import get_session
from src.filters import BuildingFilter
from src.models import Building
from src.utils import search_buildigs, get_recommendation, get_model, set_model, get_excel_file, get_addresses, set_coordinates

router = APIRouter()


@router.get("/buildings", status_code=200, dependencies=[Depends(Authorization(role='user'))])
async def search_building(
        id: str = None,
        building_filter: BuildingFilter = FilterDepends(BuildingFilter),
        session: AsyncSession = Depends(get_session)) -> dict:
    """ Получить объекты с рекомендацией """
    buildings, file_id = await search_buildigs(building_filter=building_filter, id=id, session=session)
    return {'buildings': buildings, 'file_id': file_id}

@router.get("/download-report", status_code=200, dependencies=[Depends(Authorization(role='user'))])
async def download_excel_file(file_id: str):
    excel_file = await get_excel_file(file_id=file_id)
    headers = {'Content-Disposition': 'attachment; filename="sraniy.xlsx"'}
    return StreamingResponse(excel_file, media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', headers=headers)


@router.get("/recommendation", status_code=200, dependencies=[Depends(Authorization(role='user'))])
async def create_recommendation_by_unom(building_ids: Annotated[list[int] | None, Query()],
                                        session: AsyncSession = Depends(get_session)) -> list:
    """ Получить 3 рекомендации на объект """
    recommendations = await get_recommendation(building_ids=building_ids, session=session)
    return recommendations


@router.get("/learning_models", status_code=200, dependencies=[Depends(Authorization(role='user'))])
async def fetch_learning_model(session: AsyncSession = Depends(get_session)) -> list:
    """ Получить модели """
    models = await get_model(session=session)
    return models


@router.post("/learning_models", status_code=200, dependencies=[Depends(Authorization(role='user'))])
async def set_learning_model(id: str, session: AsyncSession = Depends(get_session)) -> list:
    """ Выбрать модель по умолчанию """
    name = await set_model(id=id, session=session)
    return [name]

@router.get("/adresses", status_code=200, dependencies=[Depends(Authorization(role='user'))])
async def adresses(session: AsyncSession = Depends(get_session)) -> list:
    """ Получить адреса """
    addresses = await get_addresses(session=session)
    return addresses


@router.post("/coordinates", status_code=200, dependencies=[Depends(Authorization(role='user'))])
async def test(api_keys: Annotated[list[str] | None, Query()], country: str, city: str,  session: AsyncSession = Depends(get_session)) -> list:
    """ Получить адреса """
    status = await set_coordinates(api_keys=api_keys, country=country, city=city, session=session)
    return status


