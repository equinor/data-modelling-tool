import { Configuration, DMTApi } from './configs/gen-dmt'

export class DmtAPI extends DMTApi {
  constructor(token: string) {
    const DMTConfiguration = new Configuration({
      accessToken: token,
      basePath: '/api/dmt',
    })
    super(DMTConfiguration)
  }
}
