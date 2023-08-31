from os import environ

DB_USER = environ.get("POSTGRES_USER")
DB_PASS = environ.get("POSTGRES_PASSWORD")
DB_NAME = environ.get("POSTGRES_DB")
DB_HOST = environ.get("POSTGRES_HOST")
DB_PORT = environ.get("POSTGRES_PORT")
DB_SCHEMA = environ.get("POSTGRES_SCHEMA")

CORS_URL = environ.get("CORS_URL")
FRONT_APP_HOST = environ.get("FRONT_APP_HOST")
FRONT_APP_PORT = environ.get("FRONT_APP_PORT")
AUTH_APP_HOST = environ.get("AUTH_APP_HOST")
AUTH_APP_PORT = environ.get("AUTH_APP_PORT")

REDIS_HOST = environ.get("REDIS_HOST")
REDIS_PORT = environ.get("REDIS_PORT")
