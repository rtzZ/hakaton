import uvicorn
from common.config import CORS_URL, FRONT_APP_HOST, FRONT_APP_PORT
from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from settings.config import params
from src.routers import router
from starlette.middleware.cors import CORSMiddleware


def custom_openapi():
    """Настройка Swagger"""
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        version="1.0.0",
        routes=app.routes,
        **params,
    )
    app.openapi_schema = openapi_schema
    return app.openapi_schema


def run(host, port):
    uvicorn.run(app, host=host, port=port)


app = FastAPI(redoc_url=None)

""" Настройка CORS """
origins = [
    "http://localhost",
    CORS_URL,
    f"http://{FRONT_APP_HOST}:{FRONT_APP_PORT}",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
app.openapi = custom_openapi
