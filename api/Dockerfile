FROM python:3.8.0-alpine3.10 as development
ENV PYTHONUNBUFFERED=1 FLASK_APP=/code/app.py
CMD /code/init.sh
WORKDIR /code
RUN apk update && \
    pip install --upgrade pip && \
    pip install poetry && \
    poetry config settings.virtualenvs.create false
COPY pyproject.toml poetry.lock ./
RUN poetry install
COPY . /code

FROM development as prod
RUN poetry install --no-dev
