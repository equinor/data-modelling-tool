# How to release 

This docker image is not part of CI. If you want it to be updated, you need to push a new docker image manually to our docker registry,

```
docker login mariner.azurecr.io  -u mariner -p<INSERT PASSWORD>
docker build -t mariner.azurecr.io/dmt/nginx-local .
docker push mariner.azurecr.io/dmt/nginx-local
```
