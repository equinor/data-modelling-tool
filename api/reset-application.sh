#!/usr/bin/env sh
set -euo pipefail

echo "ENVIRONMENT: $ENVIRONMENT"

flask remove-application
sleep 10
flask init-application
