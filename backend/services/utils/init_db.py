from sqlalchemy import create_engine, text
from os import getenv

DB_USER = getenv('DB_USER')
DB_PASS = getenv('DB_PASS')
DB_HOST = getenv('DB_HOST')
DB_PORT = getenv('DB_PORT')
DB_NAME = getenv('DB_NAME')

e = create_engine(f'postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}')


def execute_sql(sql_file):
    if not e.dialect.has_table(e.connect(), "users"):
        with open(sql_file, 'r', encoding='UTF-8') as f:
            sql = text(f.read())
        with e.connect() as con:
            result = con.execute(sql)
        print(result)
    else:
        print("Таблица уже существуeт")


if __name__ == '__main__':
    print(DB_HOST)
    print(DB_NAME)

    execute_sql('utils/init_db.sql')




