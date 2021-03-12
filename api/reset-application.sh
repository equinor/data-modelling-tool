#!/usr/bin/env sh
set -eu

echo "ENVIRONMENT: $ENVIRONMENT"

flask remove-application
sleep 10
flask init-application
