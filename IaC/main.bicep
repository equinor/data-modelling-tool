@description('Specifies the location for resources.')
param location string = 'norwayeast'
param environment string

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
