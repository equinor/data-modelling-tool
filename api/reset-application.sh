#!/usr/bin/env sh
set -euo pipefail

echo "ENVIRONMENT: $ENVIRONMENT"

flask --help
flask remove-application
sleep 10
flask init-application
