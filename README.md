# Data Modelling Tool

![CI](https://github.com/equinor/data-modelling-tool/workflows/CI/badge.svg)

A tool for modelling and presenting blueprints.  
Architecture [diagrams](docs/architecture.md)  
Read more about the core concepts here: [DMT](docs/README_DMT.md) and [plugins](docs/README_Plugin.md)

## Getting started

We use docker-compose to run the project locally;

For Linux;

``` bash
docker-compose up
```

For Windows;

``` bash
docker-compose.exe -f docker-compose.yml  -f docker-compose.windows.yml up

```

## Exported Application

1. Unzip the downloaded file(e.g `unzip application.zip` )
2. Run `docker-compose up`
3. Visit [http://localhost:9000] in your web browser (Internet Explorer is not supported)

## Components README

[API](api/README.md)  
[WEB](web/README.md)

## Pre-commit

The project provides a `.pre-commit-config.yaml`-file that is used to setup git _pre-commit hooks_.

``` sh
pip install pre-commit
pre-commit install
```

Alternative pre-commit installations can be found [here](https://pre-commit.com/#install).

## Database

To populate the database for first-time-use;

1. Start the project with `docker-compose up`
2. Run the provided script within the running API container;  
   `docker-compose exec api ./reset-database.sh`

## Development environment

This repository includes configuration for the IntelliJ platform (including PyCharm and WebStorm).
The most useful configuration included, is likely the run / debug configurations / targets.
See below for more.

Since this repository uses multiple technologies that PyCharm / WebStorm does not support out-of-the-box, some plugins have been included.
When opening this repository in an IntelliJ IDE, you should be asked to install some plugins. 
