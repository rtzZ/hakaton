
import os

from sqlalchemy import create_engine, text
import pandas as pd
from datetime import datetime
from rq import get_current_job

from settings.database import DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_NAME
from src.service.table_config import params

STG_PREFIX = 'stg_'
e = create_engine(f'postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}')

def load_data_1(files_io: dict):
    print(files_io.keys())

    filename = '1.xlsx'

    main_sheet = 'Sheet1'
    sheets = [
        'COL_781',
        'COL_758',
        'COL_769',
        'COL_770',
        'COL_775',
        'COL_2156',
        'COL_2463',
        'COL_3163',
        'COL_3243',
        'COL_103506'
    ]

    main_df = pd.read_excel(io=files_io[filename], sheet_name=main_sheet, skiprows=range(1, 2), dtype=str)
    main_df.rename(
        columns={col: col.lower() for col in main_df.columns},
        inplace=True
    )
    main_df.rename(
        columns={col.lower(): f'{col.lower()}_id' for col in sheets},
        inplace=True
    )

    other_df = pd.read_excel(io=files_io[filename], sheet_name=sheets, skiprows=1, dtype=str)
    for sheet, df in other_df.items():
        df.rename(
            columns={col: col.lower() for col in df.columns},
            inplace=True
        )
        table_name = f'{STG_PREFIX}{sheet.lower()}'
        _insert_data(df, table_name)

    table_name = f'{STG_PREFIX}building'
    _insert_data(main_df, table_name)


def _rename_cols(df):
    return df.rename(columns={col: col.lower() for col in df.columns})


def _date_correct(df, pattern, columns):
    for col in columns:
        df[col] = df[col].apply(lambda x: datetime.strptime(x, pattern) if x else x)
    return df


def _df_to_sql(df, key_id, table_name, type_id):
    sql = f'select {key_id} from {table_name}'
    print(sql)
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
        type_id=str
):
    if skip_rows:
        df = pd.read_excel(io=files_io[filename], dtype=str, sheet_name=sheet_name, skiprows=skip_rows)
    else:
        df = pd.read_excel(io=files_io[filename], sheet_name=sheet_name, dtype=str)

    if columns:
        df.rename(columns=columns, inplace=True)
    else:
        df = _rename_cols(df)

    if date_correct:
        df = _date_correct(df, **date_correct)
    df.drop_duplicates(inplace=True)

    _insert_data(df, table_name, key_id, type_id)


def _insert_data(df, table_name, key_id='id', type_id=str):
    print(f'load data to {table_name} -> ', end='')
    df = _df_to_sql(df, key_id=key_id, table_name=table_name, type_id=type_id)
    df.to_sql(name=table_name, if_exists='append', con=e, index=False)
    print(f'Success (Update: {len(df)} records)')


def execute_sql(sql_file):
    with open(sql_file, 'r', encoding='UTF-8') as f:
        sql = text(f.read())

    with e.connect() as con:
        result = con.execute(sql)

    print(result)


def load(files_io: dict):
    load_data_1(files_io=files_io)
    for kwargs in params:
        kwargs.update({'files_io': files_io})
        load_data(**kwargs)

def _load_model_etl():
    print(f'Start update model')
    sql_text = 'SELECT * FROM public.model_test_asv_prefinal'
    data = pd.read_sql_query(sql=text(sql_text), con=e.connect())
    data = data.fillna(value=-1)
    for column in data.columns:
        data[column] = pd.to_numeric(data[column], errors='coerce')
    data.loc[data['col_754'] != -1, 'col_754'] = 0
    data = data.loc[:, (data != data.iloc[0]).any()]
    data.to_sql(name='for_model', if_exists='append', con=e, index=False)
    print(f'Success update model')


def start(files_io: dict):
    job = get_current_job()
    try:
        sql_files = {
            'init_stage': f'{os.getcwd()}/src/service/sql/init_stage.sql',
            'init': f'{os.getcwd()}/src/service/sql/init.sql',
            'init_model': f'{os.getcwd()}/src/service/sql/init_model.sql',
            'etl': f'{os.getcwd()}/src/service/sql/etl.sql',
            'model_etl': f'{os.getcwd()}/src/service/sql/model_etl.sql',
        }

        # Подготовка источника
        job.meta['stage'] = 'init_stage'
        execute_sql(sql_files.get('init_stage'))

        # Инициализация основных таблиц
        job.meta['stage'] = 'init'
        job.save_meta()
        execute_sql(sql_files.get('init'))

        # Инициализация таблиц для построения датасетов
        job.meta['stage'] = 'init_model'
        job.save_meta()
        execute_sql(sql_files.get('init_model'))

        load(files_io=files_io)  # Загрузка данных stage

        # Преобразование и нормализация данных
        job.meta['stage'] = 'etl'
        job.save_meta()
        execute_sql(sql_files.get('etl'))

        # Построение датасета
        job.meta['stage'] = 'model_etl'
        job.save_meta()
        print(sql_files.get('model_etl'))
        execute_sql(sql_files.get('model_etl'))  # +
        _load_model_etl()

        # Построение датасета
        job.meta['stage'] = 'finish'
        job.save_meta()
    except:
        job.meta['stage'] = 'finish'
        job.save_meta()

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

lala = {
    "unom": "ID Адреса",
    "col_754": "Назначение",
    "col_756": "Год постройки",
    "col_758_id": "Серии проекта",
    "col_759": "Количество этажей",
    "col_760": "Количество подъездов",
    "col_761": "Количество квартир",
    "col_762": "Общая площадь",
    "col_763": "Общая площадь жилых помещений",
    "col_764": "Общая площадь нежилых помещений",
    "col_765": "Строительный объем",
    "col_766": "Износ объекта (по БТИ)",
    "col_769_id": "Идентификатор материала стен",
    "col_770_id": "Идентификатор признака аварийности здания",
    "col_771": "Количество пассажирских лифтов",
    "col_772": "Количество грузопассажирских лифтов",
    "col_775_id": "Идентификатор очередности уборки кровли",
    "col_781_id": "Идентификатор материала кровли",
    "col_3243_id": "Идентификатор статуса управления МКД",
    "col_3363": "Количество грузовых лифтов",
    "cnt": "Все инциденты",
    "asupr": "Инциденты из системы ASUPR",
    "gormost": "Инциденты из системы GORMOST",
    "edc": "Инциденты из системы EDC",
    "mgi": "Инциденты из системы MGI",
    "cafap": "Инциденты из системы CAFAP",
    "mos_gas": "Инциденты из системы MOS_GAS",
    "mvk": "Инциденты из системы MVK",
    "ng": "Инциденты из системы NG"}