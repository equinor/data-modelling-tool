export interface IDocumentAPI {
  create(url: string, data: any): Promise<any>

  remove(url: string, data: any): Promise<any>

  update(url: string, data: any): Promise<any>

  getByPath(dataSourceId: string, path: string): Promise<any>
}
