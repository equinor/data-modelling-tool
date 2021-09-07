import { Configuration, DefaultApi } from './gen'
import { getlocalStorageAccessToken } from '../../../../../../app/src/context/auth/authentication'
const getBearerToken = () => {
  return 'Bearer ' + getlocalStorageAccessToken()
}

//@ts-ignore
const DMSSConfiguration = new Configuration({
  basePath: '/dmss',
  accessToken: getBearerToken,
})
export let dmssApi = new DefaultApi(DMSSConfiguration)
