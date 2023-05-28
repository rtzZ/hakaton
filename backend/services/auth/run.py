import os
import uvicorn
from settings.server import app

"""

Точка входа
Запуск приложения

"""

if __name__ == "__main__":
    uvicorn.run(app, host=os.environ.get('AUTH_APP_HOST'), port=int(os.environ.get('AUTH_APP_PORT')))