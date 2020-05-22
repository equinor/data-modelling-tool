# Developing DMT

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
