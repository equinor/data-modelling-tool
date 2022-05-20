@description('Specifies the location for resources.')
param location string = 'norwayeast'
@description('The location shortname for resources. Used in the resource naming prefix.')
param locationShortName string = 'NOE'
param environment string
@description('The number prefix of the subscription (e.g. "S398"). Used in the resource naming prefix.')
param subscriptionNumber string = 'S398'
param dbVirtualMachineName string = 'dmt-db-${environment}'
param virtualMachineAdmin string = 'dmt-admin'

var resourcePrefix = '${subscriptionNumber}-${locationShortName}'
var virtualMachineAdminSSHKeys = [
  // moamu@bvt
  {
    keyData: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDZIbHhCzn1fAgrVlhBxIb/9z5ssNUioXbZDbuPRw3ltclUjp9EHIXMFzD8vcHFTyNSImHhFX9QodDL/Bz13ieFTgPzvJnVWieMAt37OWmUwEbd+Sw4pDpGTwdFIuvWDpmvbMJ6zI2exO3Ip2Y6q8bQ8N2irG9+U0o+j/dIGKcgtLfSSnjPbsHrhPsVGSCwY7hZKcE4fW6hhz6YWKOKErRDfjoXH8G5CzSbUMikIB/o1ZvtoqB/0nAeEpu6VOeLT3pMEk0PxqFrG4mrmeT4RDTs4UjiEJhSxn335hY2kiX2j1HtWlUJO6An0WTdiPVhcccI3Mp7/EDLlujLJDYjjFMBANZD6sEEIuDYa6emIAPF5jwC8jEBtSqbaeU+WyzXv2nBhN5ArdG8yTqh+ijq1hYzC6EQRa6i2VMRmb7VPFO4LQOox2oz/JXjhwnGBQ2T+rPVxmfmSVHPPYnTA7oYbdbSK7FjUG/7zdneq+iKhOHWWUjRyTpLkzy9ZJoCZYVaO6kY7Hn0Kfu9fB4ra3wdPninMUkJwhn2Jv7Y8P7vIhRt6Yc2Stf96TnHwT2u4QJHEHh1upzW0vB0srzbZviVLIIyM6K7IG1aiYNgqoeAIop31dDFRhU2qldlwxjwOoBnG5qT4i5B/ftjvzn5BFpGousCfvMCXkpOcdX1P4vcnzj99Q== bvt-amu'
    path: '/home/${virtualMachineAdmin}/.ssh/authorized_keys'
  }
]
var allowedMongoIPRanges = [
  '20.223.122.0/30' // radix
  '143.97.0.0/16'   // AS42175 (Equinor ASA asn)
]

// VNET & SNET
var vnetName = '${resourcePrefix}-vnet'
var snetName = '${resourcePrefix}-snet'
resource databaseVNet 'Microsoft.Network/virtualNetworks@2021-08-01' = {
  name: vnetName
  location: location
  properties: {
    addressSpace: {
      addressPrefixes: [
        '10.0.0.0/16'
      ]
    }
    subnets: [
      {
        name: snetName
        properties: {
          addressPrefix: '10.0.0.0/24'
        }
      }
    ]
  }
}
var snetId = resourceId('Microsoft.Network/virtualNetworks/subnets', vnetName, snetName)

// NSG
var nsgName = '${resourcePrefix}-nsg'
resource databaseNSG 'Microsoft.Network/networkSecurityGroups@2021-08-01' = {
  name: nsgName
  location: location
  properties: {
    securityRules: [
      {
        name: 'default-allow-ssh-ingress'
        properties: {
          access: 'Allow'
          destinationAddressPrefix: '*'
          destinationPortRange: '22'
          direction: 'Inbound'
          priority: 1000
          protocol: 'Tcp'
          sourceAddressPrefix: '*'
          sourcePortRange: '*'
        }
      }
      {
        name: 'internal-allow-mongo-ingress'
        properties: {
          access: 'Allow'
          destinationAddressPrefix: '*'
          destinationPortRange: '10255'
          direction: 'Inbound'
          priority: 1001
          protocol: 'Tcp'
          sourceAddressPrefixes: allowedMongoIPRanges
          sourcePortRange: '*'
        }
      }
    ]
  }
}
var nsgId = resourceId('Microsoft.Network/networkSecurityGroups', nsgName)

// Public IP
var pipName = '${resourcePrefix}-ip-ext-${environment}'
resource databasePublicIP 'Microsoft.Network/publicIPAddresses@2021-08-01' = {
  name: pipName
  location: location
  properties: {
    publicIPAllocationMethod: 'Static'
    dnsSettings: {
      domainNameLabel: dbVirtualMachineName
    }
  }
  sku: {
    name: 'Standard'
  }
}
var pipId = resourceId('Microsoft.Network/publicIPAddresses', pipName)

// NIC
var nicName = '${resourcePrefix}-nic'
resource databaseNIC 'Microsoft.Network/networkInterfaces@2021-08-01' = {
  name: nicName
  location: location
  properties: {
    enableAcceleratedNetworking: true
    ipConfigurations: [
      {
        name: 'ipconfig1'
        properties: {
          privateIPAllocationMethod: 'Dynamic'
          publicIPAddress: {
            id: pipId
            properties: {
              deleteOption: 'Detach'
            }
          }
          subnet: {
            id: snetId
          }
        }
      }
    ]
    networkSecurityGroup: {
      id: nsgId
    }
  }
  dependsOn: [
    databaseVNet
    databaseNSG
    databasePublicIP
  ]
}
var nicId = resourceId('Microsoft.Network/networkInterfaces', nicName)

// Data disk
var dataDiskName = '${dbVirtualMachineName}-datadisk0'
resource databaseDataDisk 'Microsoft.Compute/disks@2021-12-01' = {
  name: dataDiskName
  location: location
  properties: {
    creationData: {
      createOption: 'Empty'
    }
    diskSizeGB: 1024
    encryption: {
      type: 'EncryptionAtRestWithPlatformKey'
    }
    osType: 'Linux'
    tier: 'P30'
  }
  sku: {
    name: 'Premium_LRS'
  }
}
var dataDiskId = resourceId('Microsoft.Compute/disks', dataDiskName)

// VM
resource databaseVM 'Microsoft.Compute/virtualMachines@2021-11-01' = {
  name: dbVirtualMachineName
  location: location
  tags: {}
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    diagnosticsProfile: {
      bootDiagnostics: {
        enabled: true
      }
    }
    hardwareProfile: {
      vmSize: 'Standard_D2s_v3'
    }
    networkProfile: {
      networkInterfaces: [
        {
          id: nicId
          properties: {
            deleteOption: 'Delete'
          }
        }
      ]
    }
    osProfile: {
      adminUsername: virtualMachineAdmin
      allowExtensionOperations: true
      computerName: dbVirtualMachineName
      linuxConfiguration: {
        disablePasswordAuthentication: true
        patchSettings: {
          patchMode: 'ImageDefault'
          assessmentMode: 'ImageDefault'
        }
        provisionVMAgent: true
        ssh: {
          publicKeys: virtualMachineAdminSSHKeys
        }
      }
    }
    storageProfile: {
      dataDisks: [
        {
          createOption: 'Attach'
          lun: 0
          managedDisk: {
            id: dataDiskId
          }
        }
      ]
      imageReference: {
        publisher: 'canonical'
        offer: '0001-com-ubuntu-server-focal'
        sku: '20_04-lts-gen2'
        version: 'latest'
      }
      osDisk: {
        createOption: 'FromImage'
        caching: 'ReadWrite'
        deleteOption: 'Delete'
        diskSizeGB: 128
        managedDisk: {
          storageAccountType: 'Premium_LRS'
        }
        name: '${dbVirtualMachineName}-disk0'
        osType: 'Linux'
      }
    }
  }
  dependsOn: [
    databaseNIC
    databaseDataDisk
  ]
}

resource AADSSHLoginLinuxDeployment 'Microsoft.Resources/deployments@2021-04-01' = {
  name: 'AADSSHLoginLinuxDeployment'
  properties: {
    mode: 'Incremental'
    templateLink: {
      uri: 'https://catalogartifact.azureedge.net/publicartifacts/microsoft.aadsshlogin-linux-arm-1.0.0/MainTemplate.json'
    }
    parameters: {
      vmName: {
        value: dbVirtualMachineName
      }
      location: {
        value: location
      }
    }
  }
  dependsOn: [
    databaseVM
  ]
}
