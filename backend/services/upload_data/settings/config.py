from os import environ

params = {
    "title": "Upload data service",
    "description": "Upload data service",
}

APP_HOST = environ.get("UPLOAD_APP_HOST")
APP_PORT = int(environ.get("UPLOAD_APP_PORT"))
