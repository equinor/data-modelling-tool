#!/usr/bin/env bash
docker-compose exec api flask nuke-db
docker-compose exec api flask init-import
docker-compose exec api flask import-all-data-sources
