#! /usr/bin/env bash
# This requires the DMSS API to be running on localhost port 8000
docker run --rm --network="host" -v ${PWD}:/local openapitools/openapi-generator-cli:v5.1.0 generate \
    -i http://127.0.0.1:8000/openapi.json \
    -g typescript-fetch \
    -o /local/gen