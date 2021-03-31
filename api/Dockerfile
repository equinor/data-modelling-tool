FROM python:3.8-slim as base
ENV PYTHONUNBUFFERED=1 FLASK_APP=/code/app.py PYTHONPATH=/code
WORKDIR /code

RUN apt-get update -y && apt-get full-upgrade -y && apt-get install -y \
    netcat \
    nodejs \
    curl
RUN pip install --upgrade pip && \
    pip install poetry
COPY pyproject.toml poetry.lock ./

FROM base as development
# poetry install is not cachable. So we install with pip
RUN poetry export -f requirements.txt --dev | pip install -r /dev/stdin
ENTRYPOINT ["./init.sh"]
CMD ["api"]
COPY . .

FROM base as prod
RUN poetry export -f requirements.txt | pip install -r /dev/stdin
ENTRYPOINT ["./init.sh"]
CMD ["api"]
COPY . .
