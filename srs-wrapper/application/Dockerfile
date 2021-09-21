# DMTSRSJW
FROM mariner.azurecr.io/sima/sima-rs:latest
LABEL Description="Docker image for Data Modelling Tool SIMA Runtime Service Job Wrapper"
EXPOSE 8082-8085

RUN pip install --upgrade pip && \
    pip install poetry && \
    poetry config virtualenvs.create false

COPY pyproject.toml pyproject.toml
COPY poetry.lock poetry.lock

# Install python dependencies
RUN poetry install
WORKDIR /code
COPY init.sh init.sh

# Add wrapper python module
COPY dmt_job_wrapper.py dmt_job_wrapper.py

WORKDIR /var/opt/sima/webapp
# Add the entry page
ADD index.jsp .

# Add the application program
ADD application.js .
ADD simple_flexible_riser.png .

# Add the application configuration
ADD application.properties /etc/opt/sima/application.properties

ENTRYPOINT ["/code/init.sh"]
CMD ["run"]
