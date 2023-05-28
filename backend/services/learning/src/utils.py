from sqlalchemy import text, select
from sqlalchemy.ext.asyncio import AsyncSession
from src.models import LearningModel
from src.service.trainer import Learn


async def learning_model(fields: list[str], model_name: str, username: str, session: AsyncSession):
    try:
        learn = Learn(filename='test_name', fields=fields)
        data, label = learn.get_data()
        model = learn.train_model(data=data, label=label)
        model_info = LearningModel(name=model_name, username=username, facts=",".join(fields))
        session.add(model_info)
        await session.flush()
        learn.save_model(id=str(model_info.id), model=model)
        await session.commit()
        await set_model(id=str(model_info.id), session=session)
        return True
    except:
        return False


async def get_column_names(session: AsyncSession):
    query = text('SELECT * FROM public.for_model;')
    column_names = list((await session.execute(query)).keys())
    column_names.remove('work_type_id')
    return list(column_names)

async def set_model(id: str, session: AsyncSession):
    try:
        query = select(LearningModel)
        result = await session.execute(query)
        models = result.scalars().all()
        for model in models:
            if str(model.id) == id:
                model.is_selected = True
            else:
                model.is_selected = False
        await session.commit()
        return True
    except:
        return False