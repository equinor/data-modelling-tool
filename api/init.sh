#!/bin/sh
set -eu

ENVIRON=${ENVIRONMENT:="production"}
FLA_ENV=${FLASK_ENV:="production"}

# Wait until the service is ready before continuing.
# This is to ensure that the service is initialized before the API tries to connect.
service_is_ready() {
  NAME=$1
  HOST=$2
  PORT=$3
  ATTEMPT_COUNTER=0
  MAX_ATTEMPTS=100
  echo "Using service $NAME: $HOST:$PORT"
  echo "Waiting for DMSS..."
  DMSS_API_ENDPOINT="http://mainapi:5000/api/v1/data-sources"
  until $(curl --output /dev/null --fail $DMSS_API_ENDPOINT); do
    if [ ${ATTEMPT_COUNTER} -eq ${MAX_ATTEMPTS} ];then
      echo "Max attempts reached."
      exit 1
    fi

    echo "Waiting for DMSS... (${ATTEMPT_COUNTER})"
    ATTEMPT_COUNTER=$((ATTEMPT_COUNTER+1))
    sleep 5
  done
  echo "DMSS is ready!"
}

if [ "$ENVIRON" = 'local' ] && [ "$FLA_ENV" = 'development' ] ; then
  echo "Installing locally..."
  pip uninstall dmss-api -y
  cd /dmss/
  python setup.py install
  cd /code/
fi

if [ ! -e first-run-false ] && [ "$ENVIRONMENT" = 'local' ]; then
  service_is_ready "DMSS" $DMSS_HOST $DMSS_PORT
  echo "Importing data"
  ./reset-application.sh
  touch first-run-false
fi


if [ "$1" = 'api' ]; then
  service_is_ready "DMSS" $DMSS_HOST $DMSS_PORT
  flask run --host=0.0.0.0
elif [ "$1" = 'behave' ]; then
  service_is_ready "DMSS" $DMSS_HOST $DMSS_PORT
  behave
else
  exec "$@"
fi
