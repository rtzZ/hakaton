import pickle

import pandas as pd
import redis
from common.config import REDIS_HOST, REDIS_PORT
from common.database import DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER
from sqlalchemy import create_engine, text


class Prediction:
    """Обучение"""

    def __init__(self, id: str, fields: str):
        self.id = id
        self.fields = fields
        self.redis = redis.StrictRedis(
            host=REDIS_HOST, port=int(REDIS_PORT), db=0
        )
        self.engine = create_engine(
            f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}",
            isolation_level="AUTOCOMMIT",
        )

    def get_prediction(self, build_ids: list) -> list:
        """Получить рекомендацию"""
        model = pickle.loads(pickle.loads(self.redis.get(self.id)))
        sql_text = (
            f"select work_type_id,{self.fields} from for_model where unom in ("
        )
        sql_text2 = sql_text + ", ".join(map(str, build_ids)) + ");"
        data123 = pd.read_sql_query(
            sql=text(sql_text2), con=self.engine.connect()
        )
        sql_text3 = "SELECT work_type_id FROM public.work where unom in ("
        sql_text4 = sql_text3 + ", ".join(map(str, build_ids)) + ");"
        d_index = pd.read_sql_query(
            sql=text(sql_text4), con=self.engine.connect()
        )
        result_ids = model.predict_proba(data123[data123.columns[1:]])
        if len(d_index) == 0:
            b = list(result_ids[0])
            return model.classes_[b.index(max(b))]
        else:
            if d_index.values[0][0] in list(model.classes_):
                b = list(result_ids[0])
                b[list(model.classes_).index(d_index.values[0][0])] = 0
                return model.classes_[b.index(max(b))]
            else:
                b = list(result_ids[0])
                return model.classes_[b.index(max(b))]

    def get_prediction2(self, build_ids: list) -> list:
        """Получить ТОП (3) рекомендации"""
        model = pickle.loads(pickle.loads(self.redis.get(self.id)))
        sql_text = (
            f"select work_type_id,{self.fields} from for_model where unom in ("
        )
        sql_text2 = sql_text + ", ".join(map(str, build_ids)) + ");"
        data123 = pd.read_sql_query(
            sql=text(sql_text2), con=self.engine.connect()
        )
        sql_text3 = "SELECT work_type_id FROM public.work where unom in ("
        sql_text4 = sql_text3 + ", ".join(map(str, build_ids)) + ");"
        d_index = pd.read_sql_query(
            sql=text(sql_text4), con=self.engine.connect()
        )
        result_ids = model.predict_proba(data123[data123.columns[1:]])
        l = []
        j = 0
        while j < 19:
            b = list(result_ids[0])
            c = sorted(b, reverse=True)
            l.append(model.classes_[b.index(c[j])])
            j += 1
        if len(d_index) == 0:
            return l[:3]
        else:
            if d_index.values[0][0] in l:
                l.remove(d_index.values[0][0])
                return l[:3]
            else:
                return l[:3]
