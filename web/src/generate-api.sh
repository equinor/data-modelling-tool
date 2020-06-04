#! /usr/bin/env bash
docker run --rm -v ${PWD}:/local openapitools/openapi-generator-cli generate \
    -i https://api-dmss-dev.playground.radix.equinor.com/api/v1/openapi.json \
    -g typescript-fetch \
    -o /local/gen
