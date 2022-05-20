# Ansible Roles and Playbooks
This repository comes with two Ansible roles, as well as two Ansible playbooks. This document will outline how these are used in this project.

## Roles
### common
_Includes tasks for common necessities, such as packages needed and the creation of service users, etc._
#### Tasks:
[`users.yml`](../roles/common/tasks/users.yml):
- Handles user creation
- Adds any public keys to the users' authorized_keys
- Removes generic default users (such as "games")

[`groups.yml`](../roles/common/tasks/groups.yml)
- Handles group creation

[`packages.yml`](../roles/common/tasks/packages.yml)
- Handles installation of wanted apt packages
- Handles installation of wanted pip packages
- Handles removal of unwanted/unused apt packages

[`directories.yml`](../roles/common/tasks/directories.yml)
- Handles creation of directories

### mongo
_Includes tasks for the deployment of the Mongo service_
#### Tasks:
[`deploy_mongo.yml`](../roles/mongo/tasks/deploy_mongo.yml)
- Copies config template over to the remote host
- Pulls Docker image from registry
- Deploys the mongo service as a container
[`tls.yml`](../roles/mongo/tasks/tls.yml)
- Creates a directory for the TLS (SSL) certificate files
- Writes the full-chain server certificate (PEM) and root certificate authority certificate (PEM) to disk
- Sets file permissions and ownership

## Playbooks
### [`init-host.yml`](../init-host.yml)
_Consider this the initial script you'd run when setting up a new instance. It uses the role 'common' described above to install required packages and create the service user used for deployment, as well as an external role, `geerlingguy.docker`, which installs `docker` and `docker-compose`. Usually only needs a single execution per host._

### [`deploy-database.yml`](../deploy-database.yml)
_A playbook which handles the deployment of the MongoDB service. It uses the role 'mongo' described above to retrieve and deploy the container on the host. Also contains the necessary secrets, which have been encrypted using `ansible-vault`._
- NB: Make sure that you run this playbook with a non-sudo user (e.g. `dmt-db`, which is created automatically by the `common` role)