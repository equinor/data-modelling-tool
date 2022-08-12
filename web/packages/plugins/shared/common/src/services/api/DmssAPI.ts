import { Configuration, DefaultApi } from './configs/gen'

export class DmssAPI extends DefaultApi {
  constructor(token: string) {
    const DMSSConfiguration = new Configuration({
      basePath: '/api/dmss',
      accessToken: token,
    })
    super(DMSSConfiguration)
  }
}

export default DmssAPI
