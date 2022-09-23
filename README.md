# Data Modelling Tool
[![License][license-badge]][license]
[![On master push][on-master-push-branch-badge]][on-master-push-branch-action]

The data modelling tool is a tool for modelling complex domain models.

Some features:

* Create, view, and search models
* Create applications containing custom views, models, and actions
* Generate code that reflects models

## Documentation

You can find the Data Modelling Tool documentation here; [https://equinor.github.io/data-modelling-tool](https://equinor.github.io/data-modelling-tool).

## Developing
 
When running locally, in development mode, DMSS need to be running alongside DMT. Since DMT use the same virtual network as DMSS, DMSS needs to be started first.

### Starting

```shell
cd ../data-modelling-storage-service
docker-compose up
cd ../data-modelling-tool
docker-compose up
```

The web app will be served at http://localhost

### Import data and reset database

Import local documents to the configured DMSS_HOST (from /api/home directory).  
Token is optional, but required if DMSS is configured with authentication.  
Token can be acquired from the DMT Web application.

```shell
docker-compose run --rm api reset-app --token=Eyxx.xxxx.xxxx
```

If the data is corrupted or in a bad state, a hard reset of the DMSS is often a solution.
This command will remove every _mongo database using the same database host as the core_, and upload DMSS's core documents.

```shell
docker-compose run --rm dmss reset-app
```

### Running Tests

Unit tests:

`docker-compose run --rm api pytest`  
`docker-compose run --rm web yarn test`

### Pre-commit

We use pre-commit to do a minimum of checks on the developer pc before committing. The same checks, plus a few more are
also run in the build pipeline.  
You should catch any errors early to save time.

Setup;

```shell
pip install pre-commit  # Should be installed in global python environment
pre-commit install  # Pre-commit will now run on every commit (can be skipped with 'git commit --no-verify')

# To run manually on all files
pre-commit run -a 
```

## Contributing 

Read our [contributors' guide](https://https://equinor.github.io/data-modelling-tool/contribute-guide.html) to get started.

[license-badge]: https://img.shields.io/badge/License-MIT-yellow.svg
[license]: https://github.com/equinor/data-modelling-tool/blob/master/LICENSE
[releases]: https://github.com/equinor/data-modelling-tool/releases
[on-master-push-branch-badge]: https://github.com/equinor/data-modelling-tool/actions/workflows/on-master-push.yaml/badge.svg
[on-master-push-branch-action]: https://github.com/equinor/data-modelling-tool/actions/workflows/on-master-push.yaml