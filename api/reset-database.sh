#!/usr/bin/env sh
set -eu

mkdir -p /code/schemas/documents/entities

flask nuke-db

echo "ENVIRONMENT: $ENVIRONMENT"

if [ "$ENVIRONMENT" = 'local' ]; then
    flask drop-data-sources
    echo "Populating database"
    for dataSource in /code/schemas/data-sources/"${ENVIRONMENT}"-mongo-*.json ; do
      flask import-data-source "$dataSource"
    done
fi

flask import-packages
