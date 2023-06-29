FROM python:3.10

ENV PYTHONUNBUFFERED 1
ENV PYTHONPATH /app

RUN mkdir /app
COPY requirements.txt /app
#COPY . /app
WORKDIR /app

RUN python -m pip install --upgrade pip  && \
    pip install pipenv && \
    pipenv install
