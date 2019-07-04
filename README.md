[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

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
