FROM python:3.8-slim as base
ENV PYTHONUNBUFFERED=1 FLASK_APP=/code/app.py PYTHONPATH=/code
WORKDIR /code

RUN apt-get update -y && apt-get full-upgrade -y && apt-get install -y \
    netcat \
    nodejs \
    curl
RUN pip install --upgrade pip && \
    pip install poetry && \
    poetry config virtualenvs.create false
COPY pyproject.toml poetry.lock ./

FROM base as development
RUN poetry install
ENTRYPOINT ["./init.sh"]
CMD ["api"]
COPY . .

FROM base as prod
RUN poetry install --no-dev
ENTRYPOINT ["./init.sh"]
CMD ["api"]
COPY . .
