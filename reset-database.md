# How to reset Azure database


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
   4. `MONGO_URI`: The Mongo connection string of the Mongo database for the environment you wish to reset.
   5. Source the environment variables:
      1. `source reset-db.env`
3. Running the reset script
   1. Print help: `./reset-db.sh -h`
   2. Run the script: `./reset-db.sh`
   3. Run and create a new secret key: `./reset-db.sh --create-key`
      1. NB: Make sure to set the new key in the Radix secrets for DMSS for the environment you wish to reset.
      2. The new secret key is written to a file named `generated-secret-key.env`
4. Go to the local DMSS repo and reset changes made to the system.json file (The reset script will change the mongo connection info in this file)

_Dev URL_  
DMSS_API=<https://dmss-data-modelling-tool-dev.radix.equinor.com>

_Prod URL_  
DMSS_API=<https://dmss-data-modelling-tool-prod.radix.equinor.com>
