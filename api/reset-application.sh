#!/usr/bin/env sh
set -euo pipefail

echo "ENVIRONMENT: $ENVIRONMENT"

flask --help
flask remove-application
flask init-application
