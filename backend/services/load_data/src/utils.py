import os
import pickle

import redis as red
import requests
from openpyxl import writer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from src.filters import BuildingFilter
from src.models import Building, Recommendation, LearningModel, AddressPos, Event
from src.service.ai import Prediction
import pandas as pd
import io
import uuid
from pandas import option_context

async def get_model_id(session: AsyncSession):
    """ Получает информацию о модели """
    query = select(LearningModel).where(LearningModel.is_selected == True)
    model_info = (await session.execute(query)).scalar()
    return model_info


async def search_buildigs(building_filter: BuildingFilter, session: AsyncSession, id: str = None):
    """ Поиск адреса и выдача рекомендации """
    buildings_with_rec = []
    file_id = ""
    try:
        if building_filter.d__in:
            building_filter.d__in = ','.join(['д.' + house_number for house_number in building_filter.d__in.split(',')])
        if building_filter.k__in:
            building_filter.k__in = ','.join(['к.' + house_number for house_number in building_filter.k__in.split(',')])
        query = building_filter.filter(select(Building))
        result = await session.execute(query)
        buildings = result.scalars().all()
        model_info = await get_model_id(session=session)
        prediction = Prediction(id=str(model_info.id), fields=model_info.facts)

        buildings_with_rec = []
        for build in buildings:
            fields = int(prediction.get_prediction([build.unom]))
            query = select(Recommendation).filter(Recommendation.id.in_([fields]))
            recommendations = (await session.execute(query)).scalar()
            buildings_with_rec.append({'build': build, 'recommendation': recommendations})

        # return buildings_with_rec, file_id
    finally:
        """ Генерируем excel file """
        if buildings_with_rec:
            buildings_parsed = [{'build': building.get('build').to_dict(ignored_fields=['id', 'd', 'unom', 'k', 's', 'col_754']),
                     'reccomendation': building.get('recommendation').to_dict(ignored_fields=['id'])} for building in
                    buildings_with_rec]
            new = []
            for buildings_p in buildings_parsed:
                temp = dict(buildings_p.get('build').copy())
                temp.update(buildings_p.get('reccomendation').copy())
                new.append(temp)

            pd.set_option('display.max_colwidth', 150)
            df = pd.DataFrame.from_dict(new)
            df = df.rename(columns=column_names)

            df = df[['Адрес', 'Год постройки', 'Количество квартир', 'Количество подъездов',
                     'Количество пассажирских лифтов',
                     'Количество грузопассажирских лифтов', 'Количество грузопассажирских лифтов',
                     'Признак аварийности здания',
                     'Материалы стен', 'Общая площадь нежилых помещений', 'Общая площадь жилых помещений',
                     'Наименование объекта общего имущества', 'Тип работ', 'Наименование',
                     'Сокращенное наименование работы'
                     ]]

            redis = red.StrictRedis(host=os.environ.get('REDIS_HOST'), port=int(os.environ.get('REDIS_PORT')), db=0)
            file_id = f"file:{str(uuid.uuid4())}"
            redis.set(file_id, pickle.dumps(df))
        return buildings_with_rec, file_id

async def get_excel_file(file_id: str):
    redis = red.StrictRedis(host=os.environ.get('REDIS_HOST'), port=int(os.environ.get('REDIS_PORT')), db=0)
    df = pickle.loads(redis.get(file_id))
    excel_bytes = io.BytesIO()
    writer = pd.ExcelWriter(excel_bytes, engine='xlsxwriter')

    # df.to_excel(writer, excel_bytes, sheet_name='Объекты')
    df.to_excel(writer, sheet_name='Объекты')

    worksheet = writer.sheets['Объекты']  # Access the Worksheet

    header_list = df.columns.values.tolist()  # Generate list of headers
    for i in range(0, len(header_list)):
        worksheet.set_column(i, i, len(header_list[i])+10)  # Set column widths based on len(header)

    writer.close()
    excel_bytes.seek(0)
    return excel_bytes

async def get_addresses(session: AsyncSession):
    addresses = []
    try:
        query = select(Building.address) # AddressPos
        result = await session.execute(query)
        addresses = result.scalars().all()
    finally:
        return addresses


async def set_coordinates(api_keys: list[str], country: str, city: str, session: AsyncSession):
    full_addresses = []
    api_key = api_keys
    try:
        query = select(Building.address) # AddressPos
        result = await session.execute(query)
        addresses = result.scalars().all()
        query = select(AddressPos).filter(AddressPos.address.in_(addresses))
        result = await session.execute(query)
        full_addresses = result.scalars().all()

        i = 0
        for full in full_addresses:
            if full.soor == 'hh':
                pos = None
                try:
                    pos = get_coordinates(country=country, city=city, address=full.address, api_key=api_key[i])
                except:
                    try:
                        if i == len(api_key):
                            break
                        i += 1
                        pos = get_coordinates(country=country, city=city, address=full.address, api_key=api_key[i])
                    except:
                        await session.commit()
                        break
                if pos:
                    full.soor = f"{pos[1]},{pos[0]}"
                    print(f"Adress: {full.address} pos: {full.soor}")
        await session.commit()
    finally:
        return full_addresses

def get_coordinates(country: str, city: str, address: str, api_key: str):
    pos = None
    try:
        resp = requests.get(f"https://geocode-maps.yandex.ru/1.x?apikey={api_key}"
                            f"&geocode={country}, {city} {address}"
                            f"&format=json")
        pos = resp.json().get('response').get('GeoObjectCollection').get('featureMember')[0].get(
                            'GeoObject').get('Point').get('pos').split(' ')
    finally:
        return pos


async def get_recommendation(building_ids: list[int], session: AsyncSession, id: str = None):
    """ Возвращает ТОП 3 рекомендации """
    recommendations = []
    try:
        model_info = await get_model_id(session=session)
        prediction = Prediction(id=str(model_info.id), fields=model_info.facts)

        prediction_result = prediction.get_prediction2(building_ids)
        query = select(Recommendation).filter(Recommendation.id.in_(prediction_result))
        recommendations = (await session.execute(query)).scalars().all()
    finally:
        return recommendations


async def get_model(session: AsyncSession):
    """ Возвращает модели """
    query = select(LearningModel)
    result = await session.execute(query)
    models = result.scalars().all()
    return models


async def set_model(id: str, session: AsyncSession):
    """ Устанавливает модель по умолчанию """
    query = select(LearningModel)
    result = await session.execute(query)
    models = result.scalars().all()
    name = ''
    for model in models:
        if str(model.id) == id:
            model.is_selected = True
            name = model.name
        else:
            model.is_selected = False
    await session.commit()
    return name

column_names = {
    'address': 'Адрес',
    'col_756': 'Год постройки',
    'col_761': 'Количество квартир',
    'col_760': 'Количество подъездов',
    'col_771': 'Количество пассажирских лифтов',
    'col_772': 'Количество грузопассажирских лифтов',
    'col_770': 'Признак аварийности здания',
    'col_769': 'Материалы стен',
    'col_764': 'Общая площадь нежилых помещений',
    'col_763': 'Общая площадь жилых помещений',

    'name_common': 'Наименование объекта общего имущества',
    'work_type': 'Тип работ',
    'name': 'Наименование',
    'work_short_name': 'Сокращенное наименование работы',



    'col_781': 'Материалы кровли по БТИ',
    'col_775': 'Очередность уборки кровли',
    'col_767': 'Класс энергоэффективности',
    'col_766': 'Износ объекта (по БТИ)',
    'col_765': 'Строительный объем',
    'col_762': 'Общая площадь',
    'col_759': 'Количество этажей',
    'col_758': 'Серии проектов',
    'col_757': 'Год реконструкции',
    'col_755': 'Форма собственности',
    'col_754': 'Назначение',
    'col_3468': 'Причина изменения статуса',
    'col_3363': 'Количество грузовых лифтов',
    'col_3243': 'Статусы управления МКД',
    'col_3163': 'Статусы МКД',
    'col_2463': 'Типы жилищного фонда',
    'col_2156': 'Виды социальных объектов',
    'col_103506': 'Категория МКД'
}