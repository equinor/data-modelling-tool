FROM python:3.7.3-alpine3.10 as base
ENV PYTHONUNBUFFERED=1 FLASK_APP=/code/app.py
CMD flask run --host=0.0.0.0
WORKDIR /code
RUN apk update && \
    pip install --upgrade pip && \
    pip install poetry && \
    poetry config settings.virtualenvs.create false
COPY pyproject.toml poetry.lock ./

FROM base as development
RUN poetry install
COPY . /code

FROM development as test
RUN safety check

FROM base as production
RUN poetry install --no-dev
COPY . /code
