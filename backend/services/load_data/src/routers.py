from dataclasses import Field
from typing import Annotated, List, Optional

from fastapi import APIRouter, Depends, Query
from fastapi.security import HTTPAuthorizationCredentials
from fastapi_filter import FilterDepends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.requests import Request
from starlette.responses import JSONResponse
from app_utils.auth import Authorization
from settings.database import get_session
from src.filters import BuildingFilter
from src.models import Building
from src.utils import search_buildigs, get_recommendation, get_model, set_model

router = APIRouter()


@router.get("/buildings", status_code=200, dependencies=[Depends(Authorization(role='user'))])
async def search_building(
        id: str = None,
        building_filter: BuildingFilter = FilterDepends(BuildingFilter),
        session: AsyncSession = Depends(get_session)) -> list:
    buildings = await search_buildigs(building_filter=building_filter, id=id, session=session)
    return buildings


@router.get("/recommendation", status_code=200, dependencies=[Depends(Authorization(role='user'))])
async def create_recommendation_by_unom(building_ids: Annotated[list[int] | None, Query()],
                                        session: AsyncSession = Depends(get_session)) -> list:
    recommendations = await get_recommendation(building_ids=building_ids, session=session)
    return recommendations


@router.get("/learning_models", status_code=200, dependencies=[Depends(Authorization(role='user'))])
async def fetch_learning_model(session: AsyncSession = Depends(get_session)) -> list:
    models = await get_model(session=session)
    return models


@router.post("/learning_models", status_code=200, dependencies=[Depends(Authorization(role='user'))])
async def set_learning_model(id: str, session: AsyncSession = Depends(get_session)) -> list:
    name = await set_model(id=id, session=session)
    return [name]
