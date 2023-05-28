FROM python:3.10

ENV PYTHONUNBUFFERED 1

RUN mkdir /app
#COPY . /app
COPY requirements.txt /app
WORKDIR /app

RUN python -m pip install --upgrade pip  && \
    pip install pipenv && \
    pipenv install
