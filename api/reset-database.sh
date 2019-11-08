#!/usr/bin/env sh

flask nuke-db

echo "ENVIRONMENT: $ENVIRONMENT"

if [ "$ENVIRONMENT" = 'local' ]; then
    flask drop-data-sources
    echo "Populating database"
    for dataSource in /home/data_sources/"${ENVIRONMENT}"*.json ; do
      flask import-data-source "$dataSource"
    done
fi

flask init-application
