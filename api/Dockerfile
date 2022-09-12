FROM python:3.10-slim as base
ENV PYTHONUNBUFFERED=1 PYTHONPATH=/code/src
WORKDIR /code
ENTRYPOINT ["./init.sh"]
CMD ["api"]
EXPOSE 5000

RUN apt-get update -y && apt-get full-upgrade -y && apt-get install -y curl

ENV PATH="/code/.venv/bin:$PATH"

RUN pip install --upgrade pip && \
    pip install poetry && \
    poetry config virtualenvs.in-project true

COPY pyproject.toml poetry.lock ./

FROM base as development
RUN poetry install
WORKDIR /code/src
COPY src .
COPY .flake8 .bandit ./


FROM base as prod
RUN poetry install --no-dev
WORKDIR /code/src
COPY src .
USER 1000
