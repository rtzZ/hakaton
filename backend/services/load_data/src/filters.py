from typing import Any, AsyncIterator, List, Optional, Annotated

from fastapi import Query
from fastapi_filter.contrib.sqlalchemy import Filter
from pydantic import Field

from src.models import Building


class BuildingFilter(Filter):
    """ Получить объекты по фильтрам"""
    address__ilike: Optional[str] = Field(Query(None, description="Адрес объекта"), alias="name")
    d__ilike: Optional[str] = Field(Query(None, description="Дом объекта"), alias="house_number")
    col_756__in: Optional[list[int]] = Field(Query(None, description="Год постройки"), alias="build_year")
    col_771__lt: Optional[int] = Field(Query(None, description="Количество лифтов"), alias="lift_count")
    col_759__in: Optional[list[int]] = Field(Query(None, description="Количество этажей"), alias="stage_count")
    col_760__in: Optional[list[int]] = Field(Query(None, description="Количество подъездов"), alias="hall_count")
    col_761__in: Optional[list[int]] = Field(Query(None, description="Количество квартир"), alias="flat_count")
    col_770__ilike: Optional[str] = Field(Query(None, description="Аварийность"), alias="accident_id")
    unom__in: Optional[list[int]] = Field(Query(None, description="build_id"), alias="build_id")

    class Constants(Filter.Constants):
        model = Building

    class Config:
        allow_population_by_field_name = True
