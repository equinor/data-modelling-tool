FROM python:3.8.0-alpine3.10 as development
ENV PYTHONUNBUFFERED=1 FLASK_APP=/code/app.py PYTHONPATH=/code

WORKDIR /code
RUN apk update && \
    # Needed to compile a poetry dependecy(cryptography)
    apk add gcc musl-dev python3-dev libffi-dev openssl-dev && \
    pip install --upgrade pip && \
    pip install poetry && \
    poetry config virtualenvs.create false
COPY pyproject.toml poetry.lock ./
RUN poetry install
COPY . /code
ENTRYPOINT ["./init.sh"]
CMD ["api"]

FROM development as prod
RUN poetry install --no-dev
