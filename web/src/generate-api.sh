#! /usr/bin/env bash
docker run --rm --network="host" -v ${PWD}:/local openapitools/openapi-generator-cli generate \
    -i http://127.0.0.1:8000/api/v1/openapi.json \
    -g typescript-fetch \
    -o /local/gen
