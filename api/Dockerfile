FROM python:3.9-slim as base
ENV PYTHONUNBUFFERED=1 FLASK_APP=/code/app.py PYTHONPATH=/code
WORKDIR /code
ENTRYPOINT ["./init.sh"]
CMD ["api"]

RUN apt-get update -y && apt-get full-upgrade -y && apt-get install -y \
    nodejs \
    curl
RUN pip install --upgrade pip && \
    pip install poetry && \
    poetry config virtualenvs.create false

COPY pyproject.toml poetry.lock ./

FROM base as development
RUN poetry install
COPY src .
COPY .flake8 .bandit ./
#USER 1000

FROM base as prod
RUN poetry install --no-dev
COPY src .
USER 1000