import { AuthenticationContext } from 'react-adal'

export const adalConfig = {
  tenant: '3aa4a235-b6e2-48d5-9195-7fcf05b459b0',
  clientId: '97a6b5bd-63fb-42c6-bb75-7e5de2394ba0',
  endpoints: {
    api: '97a6b5bd-63fb-42c6-bb75-7e5de2394ba0',
  },
  cacheLocation: 'localStorage',
}

export const authContext = new AuthenticationContext(adalConfig)
