FROM ubuntu
LABEL Description="Docker image for testing analysis jobs"

#RUN useradd --system --uid 1000 nonrootuser
RUN apt-get update
RUN apt-get install -y python3 python3-pip


RUN pip3 install --upgrade pip && \
    pip3 install poetry && \
    poetry config virtualenvs.create false
WORKDIR /code
# Install python dependencies
COPY pyproject.toml pyproject.toml
COPY poetry.lock poetry.lock
RUN poetry install
# Init script and wrapper script
COPY init.sh init.sh
RUN chmod 777 init.sh
COPY wrapper.py wrapper.py
#USER nonrootuser
ENTRYPOINT [ "bash", "init.sh" ]


