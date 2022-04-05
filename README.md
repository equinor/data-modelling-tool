# Data Modelling Tool

![CI](https://github.com/equinor/data-modelling-tool/workflows/.github/workflows/main.yaml/badge.svg)

The data modelling tool is a tool for modelling complex domain models.

Some features:

* Create, view, and search models
* Create applications containing custom views, models, and actions
* Generate code that reflects models

## Documentation

You can find the Data Modelling Tool documentation [here](https://potential-train-e73e8904.pages.github.io/).

## Developing
 
Please see [developer docs](https://potential-train-e73e8904.pages.github.io/developer-manual.html) for how to get the Data Modelling Tool up and running on your local machine for development and testing purposes.

## Contributing 

Read our [contributors' guide](https://potential-train-e73e8904.pages.github.io/contribute-guide.html) to get started.


## How to reset Azure database
As of 4. April, only a database for the test version is set up. This can be found in the dmt-test resource group in the subscription S398-DataModellingTool.

Before run, go to DMSS local folder and substitte the src/home/system/data_sources/system.json file with correct connection info (host, port, username and password).

Also, change the DMSS docker-compose.override.yml file: set the MONGO_AZURE_URI: env variable and set AUTH_ENABLED true.
 Afterwards, you can start up dmss as normal with docker-compose 
NB! DO NOT COMMIT DATABASE PASSWORD TO DMSS REPO!



1. Set the necessary environment variables:
   1. Copy the env-template file `reset-db.env-template`:
      1. `cp reset-db.env-template reset-db.env`
   2. Modify the new file `reset-db.env` to set the environment variables:
      1. `TOKEN`: A JWT (access token) from the DMT application.
      2. `DMSS_API`: The full URL to the DMSS API for the environment you wish to reset.
      3. `SECRET_KEY`: The secret key that was used to encrypt the data in the environment you wish to reset.
         1. Note: If you wish to generate a new secret key, this value can be left blank.
            1. NB: Make sure to run the script with `--create-key`.
            2. NB! remeber to update the SECRET_KEY environment variable in radix. 
      4. `MONGO_AZURE_URI`: The Mongo connection string of the Mongo database for the environment you wish to reset.
   3. Source the environment variables:
      1. `source reset-db.env`
2. Run the script:
   1. Print help: `./reset-db.sh -h`
   2. Run the script: `./reset-db.sh`
   3. Run and create a new secret key: `./reset-db.sh --create-key`
      1. NB: Make sure to set the new key in the Radix secrets for DMSS for the environment you wish to reset.
      2. The new secret key is written to a file named `generated-secret-key.env`
   

_Dev URL_  
DMSS_API=https://dmss-data-modelling-tool-dev.radix.equinor.com

_Prod URL_  
DMSS_API=https://data-modelling-tool.app.radix.equinor.com