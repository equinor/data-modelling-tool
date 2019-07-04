FROM python:3.7-alpine3.10 as base
ENV PYTHONUNBUFFERED=1
WORKDIR /code
RUN apk update && pip install --upgrade pip && pip install pipenv
COPY Pipfile Pipfile.lock ./
RUN pipenv install --system --deploy
COPY . /code
CMD python3 /code/app.py
