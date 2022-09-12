#! /usr/bin/env bash
# This requires the DMSS API to be running on localhost port 8000
docker run --ulimit nofile=122880:122880 --rm --network="host" -v ${PWD}:/local openapitools/openapi-generator-cli:v5.1.0 generate \
    -i http://127.0.0.1:8000/openapi.json \
    -g typescript-axios \
    --additional-properties=useSingleRequestParameter=true,withSeparateModelsAndApi=true,apiPackage=api,modelPackage=models \
    -o /local/gen