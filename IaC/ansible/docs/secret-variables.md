# Managing secrets
The secrets used by our Ansible playbooks are encrypted using [`ansible-vault`](https://docs.ansible.com/ansible/latest/cli/ansible-vault.html).

These secrets reside inside the directory named [`vars`](../vars):
- [`mongo.yml`](../vars/mongo.yml)
- [`common.yml`](../vars/common.yml)
- [`tls.yml`](../vars/tls.yml)

## Creating new secret variable files (starting from scratch)
>⚠️ NB: Make sure to encrypt the variable files when you're done modifying!

### [`mongo-template.yml`](../vars/mongo-template.yml)
- Run `cp vars/mongo-template.yml vars/mongo.yml` to copy the template, then modify the variables as per your needs.
- **At a minimum**, you must:
  - Set a domain name for the host, `domain:`.
    - If you've deployed with the `databaseVM.bicep` template, this should be something like "`<location>`.cloudapp.azure.com"
  - Set a password for the mongodb root user, `mongo_root_password:`.
- **When you're done editing, encrypt the file by running** `ansible-vault encrypt --vault-password-file .vault-pwd vars/mongo.yml`

### [`common-template.yml`](../vars/common-template.yml)
- Run `cp vars/common-template.yml vars/common.yml` to copy the template, then modify the variables as per your needs.
- **At a minimum**, you should add your SSH public key to the list of `authorized_keys` for the `service` user `dmt-db`.
- **When you're done editing, encrypt the file by running** `ansible-vault encrypt --vault-password-file .vault-pwd vars/common.yml`

### [`tls-template.yml`](../vars/tls-template.yml)
- Run `cp vars/common-template.yml vars/common.yml` to copy the template, then modify the variables.
- **Required:**
  - Currently, this role assumes that you're using self-signed certificates and as such, you must provide both the server certificate PEM (containing both the private key and public key) (`tls_certificate_pem`) and the Root Certificate Authority certificate (containing only the public key) (`tls_certificate_authority_crt`)
- **The variable values (not the entire file) should be encrypted**. See [Encrypted variables in an unencrypted file](#encrypted-variables-in-an-unencrypted-file) for details.

## Updating a secret (pre-existing secret variable files)
- If updating existing encrypted secrets for either `mongo.yml` or `common.yml`, skip to [Encrypted files](#encrypted-files) below.
- If updating the TLS secrets, skip to [Encrypted variables in an unencrypted file](#encrypted-variables-in-an-unencrypted-file) below.

### Encrypted files
> When the entire file has been encrypted

In order to update a secret, you'll need to decrypt the encrypted file by using `ansible-vault` first.

#### Example: Updating the secret `mongo_root_password` in `mongo.yml`
Let's say we wish to change the MongoDB root user password. We would then need to:
1. Retrieve the plaintext secret you wish to encrypt and store. For the purpose of this example, we'll pretend the password is `al023Dz#44LyK.0`
2. Ensure that the `ansible-vault` password file `.vault-pwd` is present
   1. `echo "<ansible-vault password>" > .vault-pwd`
3. Decrypt the file:
   1. Run `ansible-vault decrypt --vault-password-file .vault-pwd vars/mongo.yml`
4. Modify the unencrypted file, `vars/mongo.yml`
5. Re-encrypt the file by issuing the following command:
   1. Run `ansible-vault encrypt --vault-password-file .vault-pwd vars/mongo.yml`
6. Save the file, then stage, commit and push it to git. The secret is now updated.

### Encrypted variables in an unencrypted file
> When single variables have been encrypted

#### Example: Updating the secret by reading the contents of a file
>E.g. when setting the secrets for `tls_certificate_pem` in [`tls.yml`](../vars/tls.yml)

Let's say we have a local file `certificate.pem` in our current working directory, which we wish to encrypt the contents of.

1. Issue the following command:
`ansible-vault encrypt_string --vault-password-file .vault-pwd "$(cat certificate.pem)"`

2. Copy everything from the output, starting with `!vault`, down to the second to last line
   >⚠️ NB: Exclude the last line, "`Encryption successful`"
3. Finally, paste the copied value as a value for the variable in the file `tls.yml`

E.g.: 
```bash
# Read the file to verify contents
$ cat certificate.pem
-----BEGIN PRIVATE KEY-----
[...]

# Encrypt the contents of the file, outputting the ciphertext in the terminal
$ ansible-vault encrypt_string --vault-password-file .vault-pwd "$(cat certificate.pem)"
!vault |
    $ANSIBLE_VAULT;1.1;AES256
    6261386334323033303539326[...]
```
```yml
# Inside vars/tls.yml
tls_certificate_pem: !vault |
   $ANSIBLE_VAULT;1.1;AES256
   6261386334323033303539326[...]
```