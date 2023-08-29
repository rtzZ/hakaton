import pickle

import pandas as pd
import redis
from catboost import CatBoostClassifier, Pool
from common.config import REDIS_HOST, REDIS_PORT
from common.database import DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER
from pandas import DataFrame, Series
from sqlalchemy import create_engine, text


class Learn:
    def __init__(self, filename: str, fields: list[str]):
        self.filename = filename
        self.fields = ",".join(fields)
        self.redis = redis.StrictRedis(
            host=REDIS_HOST, port=int(REDIS_PORT), db=0
        )
        self.engine = create_engine(
            f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
        )
        self.params_cb = {
            "loss_function": "MultiClass",
            "eval_metric": "Accuracy",
            "iterations": 100,
            "verbose": False,
            "learning_rate": 0.05,
            "depth": 10,
            "random_seed": 42,
        }

    def get_data(self) -> (DataFrame, Series):
        sql_text = f"SELECT work_type_id,{self.fields} FROM public.for_model;"
        data = pd.read_sql_query(sql=text(sql_text), con=self.engine)
        data_f = data[data["work_type_id"] > 0]
        return data_f[data_f.columns[1:]], data_f["work_type_id"]

    def train_model(self, data, label) -> pickle:
        train_data = Pool(data=data, label=label)
        model = CatBoostClassifier(**self.params_cb)
        model.fit(train_data)
        pickled_object = pickle.dumps(model)
        return pickled_object

    def save_model(self, id: str, model: pickle):
        self.redis.set(id, pickle.dumps(model))

    def get_model(self, name: str) -> DataFrame:
        unpacked_object = pickle.loads(self.redis.get(name))
        model = pickle.loads(unpacked_object)
        return model
