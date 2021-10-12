#!/bin/bash
set -eu
ENVIRON=${ENVIRONMENT:="production"}
FLA_ENV=${FLASK_ENV:="production"}

# Wait until the storage services is ready before continuing.
# This is to ensure that the services is initialized before the API tries to connect.
service_is_ready() {
  ATTEMPT_COUNTER=1
  MAX_ATTEMPTS=100
  echo "Testing availability of DMSS: $DMSS_API"
  until $(curl --silent --output /dev/null --fail "$DMSS_API/api/v1/healthcheck"); do
    if [ ${ATTEMPT_COUNTER} -eq ${MAX_ATTEMPTS} ];then
      echo "ERROR: Max attempts reached. Data Modelling Storage API($DMSS_API) did not respond. Exiting..."
      exit 1
    fi

    echo "Waiting for $DMSS_API... (${ATTEMPT_COUNTER})"
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
    pip uninstall dmss-api -y -q
    pip install -e /dmss_api/ -q
  fi
}

# Try to install the local version of the DMSS-API pypi package. Soft fail.
if [ "$ENVIRON" = 'local' ] && [ "$FLA_ENV" = 'development' ]; then
  install_dmss_package
fi

TOKEN=""
# Pop the token argument from $@ so it can be injected before any subcommands
for arg do
  shift
  if [[ "$arg" == "--token"* ]]; then
    TOKEN="$arg"
    continue
  fi
  set -- "$@" "$arg"
done

if [ "$1" = 'reset-app' ]; then
  service_is_ready
  shift
  # This is quite bad. Only allows for CLI arguments before 'reset-app' subcommand.
  python /code/app.py "$TOKEN" reset-app "$@"
  exit 0
fi

if [ "$1" = 'reset-package' ]; then
  service_is_ready
  shift
  # This is quite bad. Only allows for CLI arguments before 'reset-app' subcommand.
  python /code/app.py "$TOKEN" reset-package "$@"
  exit 0
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
