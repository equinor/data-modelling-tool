@description('Specifies the location for resources.')
param location string = 'norwayeast'
param environment string
@description('The number prefix of the subscription (e.g. "S398"). Used in the resource naming prefix.')
param subscriptionNumber string = 'S398'

module dmtRedis './redis.bicep' = {
  name: 'dmt-redis-${environment}-deployment'
  params: {
    location: location
    environment: environment
  }
}

module dmtDatabase './databaseVM.bicep' = {
  name: 'dmt-db-${environment}-deployment'
  params: {
    location: location
    environment: environment
    subscriptionNumber: subscriptionNumber
  }
}
