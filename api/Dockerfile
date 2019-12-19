FROM python:3.8.0-alpine3.10 as development
ENV PYTHONUNBUFFERED=1 FLASK_APP=/code/app.py PYTHONPATH=/code
CMD /code/init.sh
WORKDIR /code
RUN apk update && \
    # Needed to compile a poetry dependecy(cryptography)
    apk add  gcc musl-dev python3-dev libffi-dev openssl-dev && \
    pip install --upgrade pip && \
    pip install poetry && \
    poetry config virtualenvs.create false
COPY pyproject.toml poetry.lock ./
RUN poetry install
COPY . /code
RUN /code/generate_system_blueprints.py

FROM development as prod
RUN poetry install --no-dev
