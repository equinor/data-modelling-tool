FROM dmtregistry.azurecr.io/sima-runtime:latest
LABEL Description="Docker image for Data Modelling Tool SIMA Headless Job Wrapper"

RUN apt-get update && \
    apt-get -y upgrade

RUN pip install --upgrade pip && \
    pip install poetry && \
    poetry config virtualenvs.create false
WORKDIR /code
# Install python dependencies
COPY pyproject.toml pyproject.toml
COPY poetry.lock poetry.lock
RUN poetry install
# Init script and wrapper script
COPY init.sh init.sh
COPY job_wrapper.py job_wrapper.py

WORKDIR /var/opt/sima
