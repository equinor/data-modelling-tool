#!/usr/bin/env sh
set -eu

echo "ENVIRONMENT: $ENVIRONMENT"

flask remove-application
flask init-application
