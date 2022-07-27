FROM python:3.10-slim as base
ENV PYTHONUNBUFFERED=1 PYTHONPATH=/code
WORKDIR /code


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
ENTRYPOINT ["./init.sh"]
CMD ["api"]

FROM base as prod
RUN poetry install --no-dev
COPY src .
USER 1000
ENTRYPOINT ["./init.sh"]
CMD ["api"]