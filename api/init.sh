#!/bin/sh
set -euo pipefail

# Wait until the service is ready before continuing.
# This is to ensure that the service is initialized before the API tries to connect.
service_is_ready() {
  NAME=$1
  HOST=$2
  PORT=$3
  echo "Using service $NAME: $HOST:$PORT"
  i=1
  while ! nc -z $HOST $PORT; do
      sleep 3
      i=$((i+1));
      if [ $i -eq 60 ]; then
          echo "Service $NAME '$HOST:$PORT' not responding. Exiting..."
          exit 1
      fi;
  done
}

echo "FLASK_ENV: $FLASK_ENV"

service_is_ready "DMSS" $DMSS_HOST $DMSS_PORT

if [ "$ENVIRONMENT" = 'local' ] && [ "$FLASK_ENV" = 'development' ] ; then
  echo "Installing locally..."
  cd /dmss/
  python setup.py install
  cd /code/
else
  pip install dmss-api
fi

if [ "$1" = 'api' ]; then
  flask run --host=0.0.0.0
else
  exec "$@"
fi
