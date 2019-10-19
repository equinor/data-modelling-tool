# data-modelling-tool

[![Build Status](https://travis-ci.com/equinor/data-modelling-tool.svg?token=yR5pmi3sbtpmzTWwTfNG&branch=master)](https://travis-ci.com/equinor/data-modelling-tool)

A tool for modelling and presenting on blue-prints (data models)
Read more about the core concepts here: [DMT](README_DMT.md) and plugins [plugins](README_Plugin.md)
### Getting started

Fill in secrets in .env file.

```
docker-compose build
docker-compose up
```

You may also want to run `./bin/setup.sh`, which installs [DoIt](https://pydoit.org), and [pre-commit](https://github.com/pre-commit/pre-commit), if they are not installed already in a local, virtual environment.
This will also install the run configurations for the IntelliJ products.
It will also make the necessary changes in the `.idea` configurations.

#### DoIt
This is a tool similar to Makefile, but uses Python.
With it, some targets are included; `doit list` for an overview of the available targets / commands, and what they do.

### Run production

To test production build locally, use the override compose.

```
docker-compose -f docker-compose.override.yml build
docker-compose -f docker-compose.override.yml up
```


## Components README

[API](api/README.md)  
[WEB](web/README.md)

## Pre-commit

```
pip install pre-commit
pre-commit install
```

Alternative pre-commit installations can be found [here](https://pre-commit.com/#install).


## Database

To populate the database for first-time-use, we will import all files in the `api/schemas/` directory.

1. Start the project with `docker-compose up`
2. Run the Flaks applications CLI command 'init-import' with;  
   `docker-compose exec api ./reset-database.sh`

## Development environment
This repository includes configuration for the IntelliJ platform (including PyCharm and WebStorm).
The most useful configuration included, is likely the run / debug configurations / targets.
See below for more.

Since this repository uses multiple technologies that PyCharm / WebStorm does not support out-of-the-box, some plugins have been included.
When opening this repository in an IntelliJ IDE, you should be asked to install some plugins. 

### Running / debugging
Run / debugging configurations for the IntelliJ platform are included.
The target `API` runs `docker-compose up`, and attaches the Python debugger to the `api` container. This allows setting breakpoints in the IDE.
That is, when starting the `API` target, there is no need to run `docker-compose up` in a separate terminal (in PyCharm / WebStorm).
There should not be an issue starting the application from the terminal, though.

No other configuration should be necessary.

There are multiple targets for debugging the client.
Two of which are a work in progress.
`WEB` will start a new Chrome browser, and stops at breakpoints in the code.
