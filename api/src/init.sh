#!/bin/sh
set -eu
ENVIRON=${ENVIRONMENT:="production"}
FLA_ENV=${FLASK_ENV:="production"}



# Wait until the storage services is ready before continuing.
# This is to ensure that the services is initialized before the API tries to connect.
service_is_ready() {
  ATTEMPT_COUNTER=1
  MAX_ATTEMPTS=100
  echo "Testing availability of DMSS: $DMSS_HOST:$DMSS_PORT"
  until $(curl --silent --output /dev/null --fail "http://$DMSS_HOST:$DMSS_PORT/api/v1/data-sources"); do
    if [ ${ATTEMPT_COUNTER} -eq ${MAX_ATTEMPTS} ];then
      echo "ERROR: Max attempts reached. Data Modelling Storage API($DMSS_HOST:$DMSS_PORT) did not respond. Exiting..."
      exit 1
    fi

    echo "Waiting for $DMSS_HOST:$DMSS_PORT... (${ATTEMPT_COUNTER})"
    ATTEMPT_COUNTER=$((ATTEMPT_COUNTER+1))
    sleep 5
  done
  echo "DMSS is ready!"
}

install_dmss_package() {
  if [ ! -e /dmss_api/setup.py ]; then
    echo "WARNING: Tried to install local version of the DMSS-API, but it could not be found. Continuing with version from Pypi..."
  else
    echo "Installing DMSS-API from local..."
    pip uninstall dmss-api -y
    pip install -e /dmss_api/
  fi
}

# Try to install the local version of the DMSS-API pypi package. Soft fail.
if [ "$ENVIRON" = 'local' ] && [ "$FLA_ENV" = 'development' ]; then
  install_dmss_package
fi

if [ "$1" = 'reset-app' ]; then
  python /code/app.py reset-app
  exit 0
fi

if [ ! -e first-run-false ] && [ "$ENVIRONMENT" = 'local' ]; then
  service_is_ready
  echo "Importing data"
  python /code/app.py reset-app
  touch first-run-false
fi

if [ "$1" = 'api' ]; then
  service_is_ready
  flask run --host=0.0.0.0
elif [ "$1" = 'behave' ]; then
  service_is_ready
  shift
  behave "$@"
else
  exec "$@"
fi
