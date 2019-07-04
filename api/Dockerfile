FROM python:3.7.3-alpine3.10 as base
ENV PYTHONUNBUFFERED=1
WORKDIR /code
RUN apk update && pip install --upgrade pip && pip install poetry && poetry config settings.virtualenvs.create false
COPY pyproject.toml poetry.lock ./
RUN poetry install
COPY . /code
CMD python3 /code/app.py
