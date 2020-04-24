#!/bin/sh
set -euo pipefail

ENVIRON=${ENVIRONMENT:="production"}
FLA_ENV=${FLASK_ENV:="production"}

# Wait until the service is ready before continuing.
# This is to ensure that the service is initialized before the API tries to connect.
service_is_ready() {
  NAME=$1
  HOST=$2
  PORT=$3
  echo "Using service $NAME: $HOST:$PORT"
  i=1
  while ! nc -z $HOST $PORT; do
      echo "Service $NAME '$HOST:$PORT' not responding. Retrying..."
      sleep 3
      i=$((i+1));
      if [ $i -eq 60 ]; then
          echo "Service $NAME '$HOST:$PORT' not responding. Exiting..."
          exit 1
      fi;
  done
}

if [ "$ENVIRON" = 'local' ] && [ "$FLA_ENV" = 'development' ] ; then
  echo "Installing locally..."
  pip uninstall dmss-api -y
  cd /dmss/
  python setup.py install
  cd /code/
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
