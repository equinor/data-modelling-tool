import { AuthenticationContext } from 'react-adal'

export const adalConfig = {
  tenant: process.env.REACT_APP_AUTH_TENANT,
  clientId: process.env.REACT_APP_AUTH_CLIENT_ID,
  endpoints: {
    api: process.env.REACT_APP_AUTH_CLIENT_ID,
  },
  cacheLocation: 'localStorage',
}

export const authContext = new AuthenticationContext(adalConfig)
