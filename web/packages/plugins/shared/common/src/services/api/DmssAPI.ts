import { Configuration, DefaultApi } from './configs/gen'

export class DmssAPI extends DefaultApi {
  constructor(token: string, basePath = '/dmss') {
    const DMSSConfiguration = new Configuration({
      basePath: basePath,
      accessToken: token,
    })
    super(DMSSConfiguration)
  }
}

export default DmssAPI
