# Ansible

## Prerequisites
- Ansible installed on your local machine
- Apt packages from [`pkg-requirements`](pkg-requirements)
- Ansible Galaxy roles from [`ansible-requirements.yml`](ansible-requirements.yml)
- Ansible Galaxy collections from [`ansible-requirements.yml`](ansible-requirements.yml)
- A `sudo` user has been created on the host(s) to configure; and
  - Your public key has been added to the user's authorized keys
  - *See the "Reset password" tab on the VM's page on the Azure Portal*
- Access to the `ansible-vault` password (stored in Azure Key Vault)

### Install requirements
```sh
# OS packages
$ sudo apt-get install $(cat pkg-requirements)
# Ansible roles
$ ansible-galaxy role install -r ansible-requirements.yml
# Ansible collections
$ ansible-galaxy collection install -r ansible-requirements.yml
```

## Running
>⚠️ NB: If your local machine is running Windows, you cannot install Ansible.

### Configure hosts
#### Modify `hosts.yml`, ensure correct IP or FQDN
_You might need to decrypt the hosts file first; `ansible-vault decrypt --vault-password-file .vault-pwd hosts.yml`
```yaml
dmt_db:
  [...]
  hosts:
    test01:
      ansible_ssh_host: <IP_ADDRESS or FQDN>
```

### Create the `ansible-vault` password file `.vault-pwd`
- NB: You need to use the password that was used for encrypting the secrets.
  - This password is currently stored in the Azure Key Vault `dmt-kv`, named `ansible-vault-password`
```sh
$ echo "<VAULT_PASSWORD>" > .vault-pwd
```

### Add your public key to the `dmt-db` user's authorized keys
1. Locate the `authorized_keys` of user `dmt-db` under `common_users` in [main.yml#L12](./roles/common/defaults/main.yml#L12)
2. Add your public key as a new entry under `authorized_keys` by adding a new line prepended with a dash (-)

### Playbook: Initialize host
*Installs Docker++, configures users, etc.*
> ⚠️ NB: This playbook requires sudo permissions. Make sure to run as the user you created in the Azure Portal with `-u <username>`
#### Run the playbook
```sh
$ ansible-playbook -i hosts.yml --vault-password-file .vault-pwd -u <username> init-host.yml
```

### Playbook: Deploy database
*Pulls docker images, runs docker-compose up*
> ⚠️ NB: This playbook should **not** be run with sudo permissions. Make sure to run as user _dmt-db_ with `-u dmt-db`
#### Run the playbook
```sh
$ ansible-playbook -i hosts.yml --vault-password-file .vault-pwd -u dmt-db deploy-database.yml
```