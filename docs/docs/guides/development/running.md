---
title: Running
sidebar_position: 1
---

## Start your application

Docker-compose is used for running the project locally.

Run the development server:

```bash
docker-compose up
```


The `docker-compose up` command builds your website locally (using docker) and serves it through a development server, ready for you to view at http://localhost/. 

The API documentation can be found at http://localhost/docs. 

The OpenAPI spec can be found at http://localhost/openapi.json

<details>
<summary>Without using docker (not recommended)</summary>

Navigate to the /api folder, activate local venv, then start backend app.py with Uvicorn:

```shell
cd api/src/  # go to the location of app.py
uvicorn app:create_app --reload
```

Navigate to the /web folder, and then start web application:

```shell
yarn start
```

</details>