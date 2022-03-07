# Data Modelling Tool API

## Importing data

Data from $DMT_HOME can be imported to DMSS by running CLI commands in the DMT API.

- Create data sources, delete existing packages, and upload all packages for every app
    ```bash
    docker-compose run --rm api reset-app
    ```
- Delete existing package, and upload new
  ```bash
  # 'reset-package' takes two arguments. $1=package on disk, $2=data source and package to upload as
  docker-compose run --rm api reset-package home/DMT/data/demoDSAlias/DMT-demo DemoDS/DMT-demo2
  
  # Example for remote DMSS with authentication
  docker-compose run --rm -e DMSS_API=https://dmss.equinor.com api --token="Ey.xxx.asd" reset-package home/DMT/data/demoDSAlias/DMT-demo DemoDS/DMT-demo2
  ```


## Job Scheduler

The job scheduler relies on JobHandler() to delegate the jobs.
The only ones supported now are a "ShellJob" for testing. It is unsafe and runs ANY shell script in the local container.
And a AzureContainerInstancesJob. This requires configuration for an Azure subscription, a resource group,
and a ServicePrincipal(App registration with app secret) which has the required access level on the resource group.
The job scheduler also needs a redis instance where jobs are kept track of.

You can also supply your own JobHandlers by volume mounting the python modules into ${HOME}/${myApp}/job_handlers/${my_job_handler_module}.
These modules MUST be a folder with a `_init_.py`-file with a `JobHandler`-class, and a global variable `_SUPPORTED_TYPE`

Example;

```python
_SUPPORTED_TYPE = "SomeDataSource/SomePackage/AJobBlueprint"

class JobHandler(JobHandlerInterface):
    def __init__(self, data_source: str, job_entity: dict):
        super().__init__(data_source, job_entity)

    def start(self) -> str:
        raise NotImplementedError

    def remove(self) -> str:
        raise NotImplementedError

    def progress(self) -> Tuple[JobStatus, str]:
        raise NotImplementedError

```

##

## Python packages

This project uses [Poetry](https://poetry.eustace.io/docs/) for its Python package management.

* If you like Poetry to create venv in the project directory, configure it like so;  
```poetry config settings.virtualenvs.in-project true```
* To create a virtual environment run `poetry install`
* To add packages run `poetry add myPackage` (Remember to rebuild the Docker image)

### Using the DMSS python package
The python API uses the DMSS python package available on [PyPi](https://pypi.org/project/dmss-api/).
If you want to use a local version of this package, you can: 

1) Build the local python package from the cloned DMSS repo, by running the generate-python-package.sh script.
2) Update the DMT docker-compose.override.yml file by adding / uncomment the volume mount: ../data-modelling-storage-service/gen/dmss_api:/dmss_api

## Running / debugging

TODO: How to add debug?

## Troubleshooting

#### Intellij Docker issue with pydevd

* Try open idea from terminal.

Mac:  /Applications/IntelliJ\ IDEA.app/Contents/MacOS/idea

`python: can't open file '/opt/.pycharm_helpers/pydev/pydevd.py': [Errno 2] No such file or directory`

<https://chkr.at/wordpress/?p=227>
