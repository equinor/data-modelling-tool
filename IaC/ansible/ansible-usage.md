# Using Ansible to manage the infrastructure

This repository comes with two Ansible roles, as well as two Ansible playbooks. This document will outline how these are used in this project.

## Roles
### common
_Includes tasks for common necessities, such as packages needed and the creation of service users, etc._
#### Tasks:
[`users.yml`](./roles/common/tasks/users.yml):
- Handles user creation
- Adds any public keys to the users' authorized_keys
- Removes generic default users (such as "games")

[`groups.yml`](./roles/common/tasks/groups.yml)
- Handles group creation

[`packages.yml`](./roles/common/tasks/packages.yml)
- Handles installation of wanted apt packages
- Handles installation of wanted pip packages
- Handles removal of unwanted/unused apt packages

[`directories.yml`](./roles/common/tasks/directories.yml)
- Handles creation of directories

### mongo
_Includes tasks for the deployment of the Mongo service_
#### Tasks:
[`deploy_container.yml`](./roles/mongo/tasks/deploy_container.yml)
- Pulls Docker image from registry
- Deploys the mongo service as a container
[`tls.yml`](./roles/mongo/tasks/tls.yml)
- Creates a directory for the TLS (SSL) certificate files
- Writes the certificate, certificate key, and DH params to disk
- Sets file permissions and ownership

## Playbooks
### [`init-host.yml`](./init-host.yml)
_Consider this the initial script you'd run when setting up a new instance. It uses the role 'common' described above to install required packages and create the service user used for deployment, as well as an external role, `geerlingguy.docker`, which installs `docker` and `docker-compose`. Usually only needs a single execution per host._

### [`deploy-database.yml`](./deploy-database.yml)
_A playbook which handles the deployment of the MongoDB service. It uses the role 'mongo' described above to retrieve and deploy the container on the host. Also contains the necessary secrets, which have been encrypted using `ansible-vault`._
- NB: Make sure that you run this playbook with a non-sudo user (e.g. `dmt-db`, which is created automatically by the `common` role)

## Secrets
The secrets used by our Ansible playbooks are encrypted using [`ansible-vault`](https://docs.ansible.com/ansible/latest/cli/ansible-vault.html).

These secrets reside inside the directory named [`vars`](./vars):
- [`secrets.yml`](./vars/secrets.yml)
- [`common.yml`](./vars/common.yml)
- [`tls.yml`](./vars/tls.yml)

### Updating a secret
In order to update a secret, you'll need to encrypt the plaintext value/data using `ansible-vault` first.
>You'll need to use the same password to encrypt all the secrets in order to successfully decrypt them at a later point.

#### Example: Updating the secret `mongo_root_username` from `secrets.yml`
Let's say we wish to change the MongoDB root user password. We would then need to:
1. Retrieve the plaintext secret you wish to encrypt and store. For the purpose of this example, we'll pretend the password is `al023Dz#44LyK.0`
2. Ensure that the `ansible-vault` password file is present
   1. `echo "<ansible-vault password>" > .vault-pwd`
3. Encrypt the secret:
   1. Run `ansible-vault encrypt_string --vault-password-file .vault-pwd "al023Dz#44LyK.0"`
   2. The command will output a result, starting with something like `!vault | $ANSIBLE_VAULT;1.1;AES256`. This is the secret you need to copy.
4. Copy everything from the output, starting with `!vault`, down to the second to last line
   1. >⚠️ NB: Exclude the last line, "`Encryption successful`"
5. Paste the secret in its entirety (make sure to include every line) as the value of the secret key you wish to change.
6. Save the file, then stage, commit and push it to git. The secret is now updated.

#### Example: Updating the secret by reading the contents of a file
>E.g. when setting the secrets for `tls_certificate_crt` in [`vars/tls.yml`](./vars/tls.yml)

Let's say we have a local file `certificate.crt` in our current working directory, which we wish to encrypt the contents of.

You would then issue the following command:
`ansible-vault encrypt_string --vault-password-file .vault-pwd "$(cat certificate.crt)"`

E.g.: 
```bash
# Read the file to verify contents
$ cat certificate.crt
-----BEGIN CERTIFICATE-----
MIIJHzCCBwegAwIBAgIEWc7oXDANBgkq
[...]

# Encrypt the contents of the file, outputting the ciphertext in the terminal
$ ansible-vault encrypt_string --vault-password-file .vault-pwd "$(cat certificate.crt)"
!vault |
    $ANSIBLE_VAULT;1.1;AES256
    62613863343230333035393263656631656339353666343636653966663966363536623433623838
    61313365623333653236[...]
```