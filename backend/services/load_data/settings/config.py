from os import environ

params = {
    "title": "Recommendation service",
    "description": "Recommendation service",
}

APP_HOST = environ.get("LOAD_APP_HOST")
APP_PORT = int(environ.get("LOAD_APP_PORT"))
