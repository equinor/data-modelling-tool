# Getting Started

How to get DMT up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

## Prerequisites

In order to run DMT you need to have installed:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- Git

## Installing

Docker-compose is used for running the project locally.

DMT depends on the [Data Modelling Storage Service](https://github.com/equinor/data-modelling-storage-service) (DMSS) for storing documents and DMSS must be cloned in same directory as DMT, since DMSS is volume mounted inside DMT container at runtime.

```bash
git clone git@github.com:equinor/data-modelling-tool.git
git clone git@github.com:equinor/data-modelling-storage service.git
cd data-modelling-tool
```

## Usage

### Running

When running locally, in development mode, DMSS need to be running alongside DMT. Since DMT try to use the same network as DMSS, DMSS needs to be started first.

```bash
cd ../data-modelling-storage-service
docker-compose up
cd ../data-modelling-tool
docker-compose up
```

The DMT will be available at http://localhost

### Stopping

```bash
docker-compose down
```

### Reset

To re-import blueprints and entities from [home directory](/api/home).

```bash
docker-compose run --rm api ./reset-application.sh
```

## Pre-commit

Code is among other things automatically prettified upon commit using precommit hooks.

The project provides a [.pre-commit-config.yaml](.pre-commit-config.yaml) file that is used to setup git _pre-commit hooks_.

```sh
pip install pre-commit
pre-commit install
```

Alternative pre-commit installations can be found [here](https://pre-commit.com/#install).

## Running Tests

Unit tests: `docker-compose run --rm api pytest`

BDD tests: `docker-compose run --rm api behave`
