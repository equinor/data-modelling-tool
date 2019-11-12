#!/bin/sh
if [ ! -e /home/first-run-false ] && [ "$ENVIRONMENT" = 'local' ]; then
  echo "Importing data"
  /code/reset-database.sh
  touch /home/first-run-false
fi
flask run --host=0.0.0.0