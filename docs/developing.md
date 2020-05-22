## Getting Started

How to get DMT up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

In order to run DMT you need to have installed:

- [Docker](https://www.docker.com/) 
- [Docker Compose](https://docs.docker.com/compose/)
- Git 

### Installing

Docker-compose is used for running the project locally. 

DMT depends on the [Data Modelling Storage Service](https://github.com/equinor/data-modelling-storage-service) (DMSS) for storing documents and DMSS must be cloned in same directory as DMT, since DMSS is volume mounted inside DMT container at runtime.

```
git clone git@github.com:equinor/data-modelling-tool.git
git clone git@github.com:equinor/data-modelling-storage service.git 
cd data-modelling-tool
```

### Usage

#### Running

Run the following from the DMT root-level directory:

For Linux;

``` bash
docker-compose up
```

For Windows;

``` bash
docker-compose.exe -f docker-compose.yml  -f docker-compose.windows.yml up
```
The DMT will be available at http://localhost

#### Stopping

``` bash 
docker-compose down
```

#### Reset 

To re-import blueprints and entities from [home directory](api/home).

```
docker-compose run --rm api ./reset-application.sh
```

### Pre-commit

Code is among other things automatically prettified upon commit using precommit hooks.

The project provides a [.pre-commit-config.yaml](.pre-commit-config.yaml) file that is used to setup git _pre-commit hooks_.

``` sh
pip install pre-commit
pre-commit install
```

Alternative pre-commit installations can be found [here](https://pre-commit.com/#install).

### Running Tests

Unit tests: ```docker-compose run --rm api pytest ```

BDD tests: ```docker-compose run --rm api behave```
