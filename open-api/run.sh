docker run --rm -v ${PWD}:/local openapitools/openapi-generator-cli generate \
    -i /local/docs/openapi.yaml \
    -g typescript-fetch \
    -o /local/out/go

cp -r out/go/src ././../web/src/open-api/