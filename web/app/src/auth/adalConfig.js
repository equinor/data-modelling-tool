import { AuthenticationContext } from 'react-adal'

export const adalConfig = {
  tenant: process.env.REACT_APP_AUTH_TENANT,
  clientId: process.env.REACT_APP_AUTH_CLIENT_ID,
  endpoints: {
    auth_endpoint: process.env.REACT_APP_AUTH_ENDPOINT,
    token_endpoint: process.env.REACT_APP_TOKEN_ENDPOINT
  },
  cacheLocation: 'localStorage',
}

export const authContext = new AuthenticationContext(adalConfig)
