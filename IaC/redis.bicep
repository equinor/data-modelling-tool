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
