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
      sleep 1
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
  cd /dmss/
  python setup.py install
  cd /code/
else
  pip install dmss-api==0.2.4
fi

if [ "$1" = 'api' ]; then
  if [ ! -e /code/home/first-run-false ] && [ "$ENVIRONMENT" = 'local' ]; then
    echo "Importing data"
    /code/reset-database.sh
    touch /code/home/first-run-false
  fi
  flask run --host=0.0.0.0
else
  exec "$@"
fi
