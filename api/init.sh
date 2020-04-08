#!/bin/sh
set -euo pipefail

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
