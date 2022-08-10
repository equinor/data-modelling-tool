import { Configuration, DMTApi } from './configs/gen-dmt'

export class DmtAPI extends DMTApi {
  constructor(token: string, basePath: string = '/dmt') {
    const DMTConfiguration = new Configuration({
      basePath: basePath,
      accessToken: token,
    })
    super(DMTConfiguration)
  }
}
