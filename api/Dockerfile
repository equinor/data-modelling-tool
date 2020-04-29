FROM python:3.8.0-alpine3.10 as base
ENV PYTHONUNBUFFERED=1 FLASK_APP=/code/app.py PYTHONPATH=/code
ENTRYPOINT ["./init.sh"]
CMD ["api"]
WORKDIR /code

RUN apk update && \
    # Needed to compile a poetry dependecy(cryptography)
    apk add --no-cache gcc musl-dev python3-dev libffi-dev openssl-dev && \
    pip install --upgrade pip && \
    pip install poetry
COPY pyproject.toml poetry.lock ./

FROM base as development
# poetry install is not cachable. So we install with pip
RUN poetry export -f requirements.txt --dev | pip install -r /dev/stdin
COPY . .

FROM base as prod
RUN poetry export -f requirements.txt | pip install -r /dev/stdin
COPY . .
