@description('Specifies the location for resources.')
param location string = 'norwayeast'
param environment string
param virtualMachineName string = 'dmt-db-${environment}'
param virtualMachineAdmin string = 'dmt-admin'
param virtualMachineAdminSSHKeys array = [
  // moamu@bvt
  {
    keyData: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDZIbHhCzn1fAgrVlhBxIb/9z5ssNUioXbZDbuPRw3ltclUjp9EHIXMFzD8vcHFTyNSImHhFX9QodDL/Bz13ieFTgPzvJnVWieMAt37OWmUwEbd+Sw4pDpGTwdFIuvWDpmvbMJ6zI2exO3Ip2Y6q8bQ8N2irG9+U0o+j/dIGKcgtLfSSnjPbsHrhPsVGSCwY7hZKcE4fW6hhz6YWKOKErRDfjoXH8G5CzSbUMikIB/o1ZvtoqB/0nAeEpu6VOeLT3pMEk0PxqFrG4mrmeT4RDTs4UjiEJhSxn335hY2kiX2j1HtWlUJO6An0WTdiPVhcccI3Mp7/EDLlujLJDYjjFMBANZD6sEEIuDYa6emIAPF5jwC8jEBtSqbaeU+WyzXv2nBhN5ArdG8yTqh+ijq1hYzC6EQRa6i2VMRmb7VPFO4LQOox2oz/JXjhwnGBQ2T+rPVxmfmSVHPPYnTA7oYbdbSK7FjUG/7zdneq+iKhOHWWUjRyTpLkzy9ZJoCZYVaO6kY7Hn0Kfu9fB4ra3wdPninMUkJwhn2Jv7Y8P7vIhRt6Yc2Stf96TnHwT2u4QJHEHh1upzW0vB0srzbZviVLIIyM6K7IG1aiYNgqoeAIop31dDFRhU2qldlwxjwOoBnG5qT4i5B/ftjvzn5BFpGousCfvMCXkpOcdX1P4vcnzj99Q== bvt-amu'
    path: '/home/${virtualMachineAdmin}/.ssh/authorized_keys'
  }
]

resource jobStore 'Microsoft.Cache/redis@2021-06-01' = {
  name: 'dmt-jobStore-${environment}'
  location: location
  properties: {
    enableNonSslPort: false
    minimumTlsVersion: '1.2'
    publicNetworkAccess: 'Enabled'
    redisVersion: '6'
    sku: {
      capacity: 0
      family: 'C'
      name: 'Basic'
    }
  }
}

resource database 'Microsoft.DocumentDB/databaseAccounts@2021-10-15'= {
  name: 'dmt-db-${environment}'
  location: location
  tags:{
    defaultExperience: 'MongoDB'
  }
  kind: 'MongoDB'
  properties: {
    capacity:{
      totalThroughputLimit: -1
    }
    // autoScale may only be set per database, not databaseAccount :(
    databaseAccountOfferType: 'Standard'
    apiProperties:{
      serverVersion: '4.0'
    }
    locations: [
      {
        failoverPriority: 0
        isZoneRedundant: false
        locationName: location
      }
    ]
  }
}

resource databaseVM 'Microsoft.Compute/virtualMachines@2021-11-01' = {
  name: virtualMachineName
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
      networkApiVersion: '2020-11-01'
      networkInterfaceConfigurations: [
        {
          name: '${virtualMachineName}-iface1'
          properties: {
            ipConfigurations: [
              {
                name: '${virtualMachineName}-ipconfig1'
                properties: {
                  primary: true
                  privateIPAddressVersion: 'IPv4'
                  // not needed?
                  publicIPAddressConfiguration: {
                    name: '${virtualMachineName}-ipconfig1-ext'
                    properties: {
                      publicIPAddressVersion: 'IPv4'
                      deleteOption: 'Delete'
                    }
                    sku: {
                      name: 'Standard'
                      tier: 'Global'
                    }
                  }
                }
              }
            ]
            deleteOption: 'Delete'
            enableAcceleratedNetworking: true
          }
        }
      ]
    }
    osProfile: {
      adminUsername: virtualMachineAdmin
      allowExtensionOperations: true
      computerName: virtualMachineName
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
      requireGuestProvisionSignal: true
      secrets: []
    }
    securityProfile: {
      encryptionAtHost: true
    }
    storageProfile: {
      dataDisks: [
        {
          createOption: 'Empty'
          deleteOption: 'Detach'
          diskSizeGB: 512
          lun: 0
          name: '${virtualMachineName}-datadisk0'
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
        deleteOption: 'Detach'
        diskSizeGB: 150
        encryptionSettings: {
          enabled: true
        }
        name: '${virtualMachineName}-disk0'
        caching: 'ReadWrite'
        managedDisk: {
          storageAccountType: 'Premium_LRS'
        }
        osType: 'Linux'
      }
    }
  }
}
