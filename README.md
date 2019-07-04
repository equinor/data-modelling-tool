# data-modelling-tool

A tool for modelling and presenting on blue-prints (data models)

### Getting started

Fill in secrets in .env file.

```
docker-compose build
docker-compose up
```

### Run production

To test production build locally, use the override compose.

```
docker-compose -f docker-compose.override.yml build
docker-compose -f docker-compose.override.yml up
```

## Components README

[API](api/README.md)  
[WEB](web/README.md)

## Database

To populate the database for first-time-use, we will import all files in the `api/schemas/` directory.

1. Start the project with `docker-compose up`
2. Run the Flaks applications CLI command 'init-import' with;  
`docker-compose exec api flask init-import`
