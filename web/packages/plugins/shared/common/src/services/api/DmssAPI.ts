import { Configuration, DefaultApi } from './configs/gen'
export class DmssAPI extends DefaultApi {
  constructor(token: string, basePath: string = '/dmss') {
    const DMSSConfiguration = new Configuration({
      basePath: basePath,
      accessToken: `Bearer ${token}`,
    })
    super(DMSSConfiguration)
  }
}

export default DmssAPI
