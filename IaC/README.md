# DMT IaC

We use __Bicep__ to define our _Infrastructure as Code_  
<https://docs.microsoft.com/en-us/azure/azure-resource-manager/bicep/overview?tabs=bicep>

## How to develop

<https://docs.microsoft.com/en-us/azure/templates/>

### How to reference existing or new resources
<https://ochzhen.com/blog/reference-new-or-existing-resource-in-azure-bicep/>

## How to test
`az bicep build --file ./IaC/main.bicep --stdout`
`az deployment group create --resource-group dmt-test --template-file ./IaC/main.bicep --what-if`

## How to deploy

Set active subscription for operations  
`az account set --subscription "S398-DataModellingTool"`

Create a resource group for the environment  
`az group create --name dmt-test --location norwayeast -o table`

### Deploy services
`az deployment group create --resource-group dmt-test --template-file ./IaC/main.bicep`
> NB: See [Deploy database VM](#deploy-database-vm) below for details on post creation actions for the database VM

### Deploy a single service
#### Deploy Redis
`az deployment group create --resource-group dmt-test --template-file ./IaC/redis.bicep`

#### Deploy database VM
`az deployment group create --resource-group dmt-test --template-file ./IaC/databaseVM.bicep`
- After creating a new VM, please follow the steps outlined in [Post-deployment actions for the database VM](#post-deployment-actions-for-the-database-vm)

### Teardown  (this deletes everything in the resource group)  
`az group delete --name dmt-test`


## Post-deployment actions for the database VM
### Data disk
> Manual steps required to partition, format, and mount the datadisk associated with the VM

> "Normal" user commands are prefixed with '`$`', and Super-user commands are prefixed with '`#`'
1. `ssh` into the host as the sudo-user (`dmt-admin` by default, see [databaseVM.bicep#L9](databaseVM.bicep#L9))
2. Become super user:
    - `$ sudo -i`
3. List the disks:
    - `# fdisk -l | less`
4. Identify the unpartitioned disk to use for data:
    - Locate the disk which should be used for storing the data
        - Usually a disk prefixed with `/dev/sd`, e.g. `/dev/sdX`, where `X` is a single letter (e.g. `c` => `/dev/sdc`)
        - The disk in question should **not** have any partitions. Take care **not** to use the disk with partitions (listed under "Device") with a "Type" of "BIOS boot" and "EFI System"
        - See example output in [fdisk_output_example.png](./fdisk_output_example.png)
5. Open the disk in `fdisk`:
    - `# fdisk /dev/sdX` (where `X` is the disk you identified in the previous step)
6. Create a GPT disklabel:
    - Enter `g` as a command, then hit `Return`
7. Create a new partition:
    - Enter `n` as a command, then accept the defaults on all prompts by hitting `Return` (3 times in total)
8. Write the new partition table:
    - Enter `w` to write the new partition table, then hit `Return`
9. Format the disk:
    - `# mkfs.ext4 /dev/sdX1` (where `X` is the disk you identified in step 4)
10. Create the data directory: `# mkdir -p /datadir`
11. Add to `/etc/fstab`:
    - Locate the `UUID` of the disk: `# blkid /dev/sdX1`
        - Copy the value inside the double-quotes (`UUID="<uuid>"`)
    - Back up the existing `fstab` for good measure:
        - `# cp /etc/fstab /etc/fstab.bak`
    - Run the following command to add the disk to the `fstab`, **replacing `<uuid>` with the UUID you identified above**:
        - `# echo "UUID=<uuid> /datadir ext4 defaults,discard 0 1" >> /etc/fstab`
12. Reload the `fstab`: `mount -av`

### Configuration and service deployment
To configure the database VM and deploy services (mongo), see the [`ansible README`](./ansible/README.md)