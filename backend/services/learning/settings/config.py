from os import environ

params = {
    "title": "Learning service",
    "description": "Learning service",
}

APP_HOST = environ.get("LEARN_APP_HOST")
APP_PORT = int(environ.get("LEARN_APP_PORT"))
