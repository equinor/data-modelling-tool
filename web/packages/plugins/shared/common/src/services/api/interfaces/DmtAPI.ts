export interface IDmtAPI {
  getSystemSettings(application?: string): Promise<any>

  postSystemSettings(application: string, data: any): Promise<any>

  createEntity(type: string, token: string): Promise<any>
}
