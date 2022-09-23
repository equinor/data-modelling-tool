---
title: "Testing"
---

This is a short canned synopsis of testing in the project.

## Running Tests

### API

#### Unit tests 

The unit tests can be found under `src/tests/unit`.

- Using docker: `docker-compose run --rm api pytest`  
- Without using docker: `pytest`

As a general rule, unit tests should not have any external dependencies - especially on the file system.

### Web

#### Unit tests 

- Using docker: `docker-compose run --rm web yarn test`
- Without using docker: `yarn install` then `yarn test`
