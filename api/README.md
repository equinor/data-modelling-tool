# Marine Analysis Framework API

## API

Endpoint:  
`/api/what/ever/path/you/like.json`

The URI after **/api** is the only argument the api accepts. 
This part of the URI is also used as the **_id** for that document in the MongoDB and must be unique.
Different actions are determent by the HTTP verb.

`HTTP GET`:  
Returns the document matching the path.  
`HTTP PUT`:  
Creates or replaces the document matching the path.  
Requires a json-object in the request data.


## Python packages

This project uses [Poetry](https://poetry.eustace.io/docs/) for its Python package management.

* If you like Poetry to create venv in the project directory, configure it like so;  
`poetry config settings.virtualenvs.in-project true`  
* To create a virtual environment run `poetry install`
* To add packages run `poetry add myPackage` (Remember to rebuild the Docker image)

## Debugging

To to be able to debug Python running in a docker-compose environment, we use a "Python Remote Debugger" in PyCharm.
1. Configure a PyCharm debugger
![remote-debugger.png](remote-debugger.png)
2. Copy your debug-egg to the project root.  
For a JetBrains Toolbox installation;  
`cp ~/.local/share/JetBrains/Toolbox/apps/PyCharm-P/ch-0/191.7479.30/debug-eggs/pydevd-pycharm.egg .`
3. Now it get's a bit weird, because of the way flask handles processes and threads, you first have to start the application with REMOTE_DEBUG = 0 in the config.py file, and then set it to 1. Hot-reloading will then enable debugging in the container.