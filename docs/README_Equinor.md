# Installation on Equinor PCs running Windows 10

## Prequisites

 -  Download the ```dmt``` source code and unzip it (or use git from the command line)
 -  A local installation of the ```data-modelling-storage-service``` is installed and running.
 
## Building and starting

Open a command prompt and navigate to the ```dmt``` source code folder. Then type 

```sh
docker-compose -f docker-compose.win10.yml build
docker-compose -f docker-compose.win10.yml -f docker-compose.override.yml up
```
