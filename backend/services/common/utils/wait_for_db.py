import time

from common.config import DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER
from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError

e = create_engine(
    f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)


def _wait():
    print("Ожидание подключения к базе данных...")
    db_conn = None
    while not db_conn:
        try:
            db_conn = e.connect()
        except OperationalError:
            print("База данных не доступна, жду 1 секунду...")
        time.sleep(1)

    print("База данных доступна!")


if __name__ == "__main__":
    print(DB_HOST)
    print(DB_NAME)

    _wait()
