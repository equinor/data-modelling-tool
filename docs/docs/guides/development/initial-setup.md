---
title: Initial Setup
sidebar_position: 1
---

## Init a new instance

Clone the **data modelling tool** repository.

```bash
git clone git@github.com:equinor/data-modelling-tool.git
```

## Install pre-commit

When contributing to this project, pre-commit is necessary, as it runs certain tests, sanitisers, and formatters.

The project provides a `.pre-commit-config.yaml` file that is used to setup git _pre-commit hooks_.

On commit locally, code is automatically formatted, checked for security vulnerabilities using pre-commit git hooks.

```shell
pre-commit install
```

This tell pre-commit to always run for this repository on every commit.

:::tip

Pre-commit will run on every commit, but can also be run manually on all files:

```shell
pre-commit run --all-files
```

Or be skipped:

```shell
git commit --no-verify 
```
:::


<!---
To enforce conventional commits:

```bash
pre-commit install --hook-type commit-msg
```
--->

## Setup API

From inside the `/api` folder.

### Create virtualenv

```shell
python3 -m venv .venv
```

Virtual environment is used for running unit tests with pre-commit and upgrade packages. 

It also can be used to run the application if you not are using Docker.

### Activate virtualenv

<details>
<summary>Linux</summary>

```shell
$ source .venv/bin/activate
```
</details>

<details>
<summary>Windows</summary>

```shell
$ .\venv\Scripts\Activate.ps1
$ pip install --upgrade pip
```

</details>

### Install Poetry

Poetry is used to manage Python package dependencies.

```shell
$ pip install poetry
# Do not create virtual environments
$ poetry config virtualenvs.create false  
```

The installation instructions for Poetry can be found [here](https://python-poetry.org/docs/#installation).

### Install packages

```shell
$ poetry install
```

## Setup Web

From inside the `/web` folder.

### Install Yarn

This project uses yarn to manage web package dependencies.

```shell
npm install -g yarn
```

The installation instructions can be found [here](https://classic.yarnpkg.com/en/docs/install).

### Install packages

```shell
yarn install
```