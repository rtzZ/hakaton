from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from src.filters import BuildingFilter
from src.models import Building, Recommendation, LearningModel
from src.service.ai import Prediction


async def get_model_id(session: AsyncSession):
    query = select(LearningModel).where(LearningModel.is_selected == True)
    model_info = (await session.execute(query)).scalar()
    return model_info


async def search_buildigs(building_filter: BuildingFilter, session: AsyncSession, id: str = None):
    buildings_with_rec = []
    try:
        query = building_filter.filter(select(Building))
        result = await session.execute(query)
        buildings = result.scalars().all()
        # if not id is None:
        #     prediction = Prediction(id=id)
        # else:
        model_info = await get_model_id(session=session)
        prediction = Prediction(id=str(model_info.id), fields=model_info.facts)

        buildings_with_rec = []
        for build in buildings:
            fields = int(prediction.get_prediction([build.unom]))
            query = select(Recommendation).filter(Recommendation.id.in_([fields]))
            recommendations = (await session.execute(query)).scalar()
            buildings_with_rec.append({'build': build, 'recommendation': recommendations})
        return buildings_with_rec
    finally:
        return buildings_with_rec


async def get_recommendation(building_ids: list[int], session: AsyncSession, id: str = None):
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
    query = select(LearningModel)
    result = await session.execute(query)
    models = result.scalars().all()
    return models


async def set_model(id: str, session: AsyncSession):
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
