@description('Specifies the location for resources.')
param location string = 'norwayeast'
param environment string


resource containerRegistry 'Microsoft.ContainerRegistry/registries@2021-12-01-preview' = {
  name: 'datamodelingtool'
  location: location
  sku: {
    name: 'Premium'
  }
  properties: {
    adminUserEnabled: true
    anonymousPullEnabled: true
    publicNetworkAccess: 'Enabled'
  }
}

resource jobStore 'Microsoft.Cache/redis@2021-06-01' = {
  name: 'dtm-jobStore-${environment}'
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
  properties: {
    databaseAccountOfferType: 'Standard'
    locations: [
      {
        failoverPriority: 0
        isZoneRedundant: false
        locationName: location
      }
    ]
  }
}
