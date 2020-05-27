# Data Modelling Tool API


## Python packages

This project uses [Poetry](https://poetry.eustace.io/docs/) for its Python package management.

* If you like Poetry to create venv in the project directory, configure it like so;  
```poetry config settings.virtualenvs.in-project true```
* To create a virtual environment run `poetry install`
* To add packages run `poetry add myPackage` (Remember to rebuild the Docker image)

## Running / debugging

TODO: How to add debug?

## Troubleshooting

#### Intellij Docker issue with pydevd

* Try open idea from terminal.

Mac:  /Applications/IntelliJ\ IDEA.app/Contents/MacOS/idea

`python: can't open file '/opt/.pycharm_helpers/pydev/pydevd.py': [Errno 2] No such file or directory`

<https://chkr.at/wordpress/?p=227>
