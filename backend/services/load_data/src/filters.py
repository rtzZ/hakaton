from typing import Any, AsyncIterator, List, Optional, Annotated

from fastapi import Query
from fastapi_filter.contrib.sqlalchemy import Filter
from pydantic import Field

from src.models import Building


class BuildingFilter(Filter):
    """ Получить объекты по фильтрам"""
    address__like: Optional[str] = Field(Query(None, description="Адрес объекта"), alias="name")
    col_756__in: Optional[list[int]] = Field(Query(None, description="Год постройки"), alias="build_year")
    d__in: Optional[list[str]] = Field(Query(None, description="Номер дома"), alias="house_number")
    k__in: Optional[list[str]] = Field(Query(None, description="Номер корпуса"), alias="corpus_number")

    col_771__lt: Optional[int] = Field(Query(None, description="Количество лифтов"), alias="lift_count_no") # 1 No
    col_771__gt: Optional[int] = Field(Query(None, description="Количество лифтов"), alias="lift_count_yes") # 0 Yes
    col_759__in: Optional[list[int]] = Field(Query(None, description="Количество этажей"), alias="stage_count")
    col_760__in: Optional[list[int]] = Field(Query(None, description="Количество подъездов"), alias="hall_count")
    col_761__in: Optional[list[int]] = Field(Query(None, description="Количество квартир"), alias="flat_count")
    col_770__ilike: Optional[str] = Field(Query(None, description="Аварийность"), alias="accident_id")
    unom__in: Optional[list[int]] = Field(Query(None, description="build_id"), alias="build_id")

    class Constants(Filter.Constants):
        model = Building

    class Config:
        allow_population_by_field_name = True
