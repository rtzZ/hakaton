import os
from datetime import datetime

import pandas as pd
from common.database import DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER
from rq import get_current_job
from sqlalchemy import create_engine, text
from src.service.table_config import params
from common.utils.logg import log


STG_PREFIX = "stg_"
e = create_engine(
    f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)


def load_data_1(files_io: dict):
    """Загрузка информации о многоквартирных домах с их характеристиками"""
    print(files_io.keys())

    filename = "1.xlsx"

    main_sheet = "Sheet1"
    sheets = [
        "COL_781",
        "COL_758",
        "COL_769",
        "COL_770",
        "COL_775",
        "COL_2156",
        "COL_2463",
        "COL_3163",
        "COL_3243",
        "COL_103506",
    ]

    main_df = pd.read_excel(
        io=files_io[filename],
        sheet_name=main_sheet,
        skiprows=range(1, 2),
        dtype=str,
    )
    main_df.rename(
        columns={col: col.lower() for col in main_df.columns}, inplace=True
    )
    main_df.rename(
        columns={col.lower(): f"{col.lower()}_id" for col in sheets},
        inplace=True,
    )

    other_df = pd.read_excel(
        io=files_io[filename], sheet_name=sheets, skiprows=1, dtype=str
    )
    for sheet, df in other_df.items():
        df.rename(
            columns={col: col.lower() for col in df.columns}, inplace=True
        )
        table_name = f"{STG_PREFIX}{sheet.lower()}"
        _insert_data(df, table_name)

    table_name = f"{STG_PREFIX}building"
    _insert_data(main_df, table_name)


@log
def _rename_cols(df):
    """Переименование колонок"""
    return df.rename(columns={col: col.lower() for col in df.columns})


@log
def _date_correct(df, pattern, columns):
    """Корректировка типов"""
    for col in columns:
        df[col] = df[col].apply(
            lambda x: datetime.strptime(x, pattern) if x else x
        )
    return df


@log
def _df_to_sql(df, key_id, table_name, type_id):
    """Преобразование данных"""
    sql = f"select {key_id} from {table_name}"
    exists_df = pd.read_sql(sql, con=e, dtype=type_id)
    return df[~df[key_id].astype(type_id).isin(exists_df[key_id])]


def load_data(
    files_io,
    filename,  # Путь к файлу источника
    table_name,  # Имя таблицы в БД
    key_id,  # Поле по которому проверяется уникальность
    skip_rows=None,  # Пропустить строки
    sheet_name=0,
    columns=None,  # Переименовать колонки
    date_correct=None,  # (pattern: str, columns: tuple) # Преобразовать поля
    type_id=str,
):
    """Загрузка датасетов 2,3,4,4.1,5"""
    if skip_rows:
        df = pd.read_excel(
            io=files_io[filename],
            dtype=str,
            sheet_name=sheet_name,
            skiprows=skip_rows,
        )
    else:
        df = pd.read_excel(
            io=files_io[filename], sheet_name=sheet_name, dtype=str
        )

    if columns:
        df.rename(columns=columns, inplace=True)
    else:
        df = _rename_cols(df)

    if date_correct:
        df = _date_correct(df, **date_correct)
    df.drop_duplicates(inplace=True)

    _insert_data(df, table_name, key_id, type_id)


@log
def _insert_data(df, table_name, key_id="id", type_id=str):
    """Вставка данных"""
    print(f"load data to {table_name} -> ", end="")
    df = _df_to_sql(df, key_id=key_id, table_name=table_name, type_id=type_id)
    df.to_sql(name=table_name, if_exists="append", con=e, index=False)
    print(f"Success (Update: {len(df)} records)")


@log
def execute_sql(sql_file):
    """Выполняеет sql инструкции"""
    with open(sql_file, "r", encoding="UTF-8") as f:
        sql = text(f.read())

    with e.connect() as con:
        result = con.execute(sql)

    print(result)


def load(files_io: dict):
    """Загрузка файлов и конфигураций"""
    load_data_1(files_io=files_io)
    for kwargs in params:
        kwargs.update({"files_io": files_io})
        load_data(**kwargs)


@log
def _load_model_etl():
    """Загрузка модули данных"""
    print("Start update model")
    sql_text = "SELECT * FROM public.for_model_prefinal"
    data = pd.read_sql_query(sql=text(sql_text), con=e.connect())
    data = data.fillna(value=-1)
    for column in data.columns:
        data[column] = pd.to_numeric(data[column], errors="coerce")
    data.loc[data["col_754"] != -1, "col_754"] = 0
    data = data.loc[:, (data != data.iloc[0]).any()]
    data.to_sql(name="for_model", if_exists="replace", con=e, index=False)
    print("Success update model")


def start(files_io: dict):
    """Создание структур"""
    job = get_current_job()
    # try:
    sql_files = {
        "init_stage": f"{os.getcwd()}/src/service/sql/init_stage.sql",
        "init": f"{os.getcwd()}/src/service/sql/init.sql",
        "init_model": f"{os.getcwd()}/src/service/sql/init_model.sql",
        "etl": f"{os.getcwd()}/src/service/sql/etl.sql",
        "init_coords": f"{os.getcwd()}/src/service/sql/init_addr_coords.sql",
        "model_etl": f"{os.getcwd()}/src/service/sql/model_etl.sql",
    }

    # Подготовка источника
    job.meta["stage"] = "init_stage"
    execute_sql(sql_files.get("init_stage"))

    # Инициализация основных таблиц
    job.meta["stage"] = "init"
    job.save_meta()
    execute_sql(sql_files.get("init"))

    # Инициализация таблиц для построения датасетов
    job.meta["stage"] = "init_model"
    job.save_meta()
    execute_sql(sql_files.get("init_model"))

    load(files_io=files_io)  # Загрузка данных stage

    # Преобразование и нормализация данных
    job.meta["stage"] = "etl"
    job.save_meta()
    execute_sql(sql_files.get("etl"))

    # Инициализация координат
    execute_sql(sql_files.get("init_coords"))

    # Построение датасета
    job.meta["stage"] = "model_etl"
    job.save_meta()
    print(sql_files.get("model_etl"))
    execute_sql(sql_files.get("model_etl"))  # +
    _load_model_etl()

    # Построение датасета
    job.meta["stage"] = "finish"
    job.save_meta()
    # except:
    #     job.meta['stage'] = 'finish'
    #     job.save_meta()

    # execute_sql(sql_files.get('create_model'))
    #
    # sql_text = 'SELECT * FROM public.model_test_asv'
    # data = pd.read_sql_query(sql=text(sql_text), con=e.connect())
    # data = data.fillna(value=-1)
    # for column in data.columns:
    #     data[column] = pd.to_numeric(data[column], errors='coerce')
    # data.loc[data['col_754'] != -1, 'col_754'] = 0
    # data = data.loc[:, (data != data.iloc[0]).any()]
    # data.to_sql(name='model_test_asv_final', if_exists='append', con=e, index=False)
