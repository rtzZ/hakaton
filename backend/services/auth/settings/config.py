from os import environ

params = {
    "title": "Authorization service",
    "description": "Authorization service",
}

APP_HOST = environ.get("AUTH_APP_HOST")
APP_PORT = int(environ.get("AUTH_APP_PORT"))
