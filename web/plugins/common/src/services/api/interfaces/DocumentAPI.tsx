export interface IDocumentAPI {
  create(url: string, data: any): Promise<any>

  remove(url: string, data: any): Promise<any>

  update(url: string, data: any): Promise<any>

  updateById(
    dataSourceId: string,
    documentId: string,
    attribute: string,
    data: any
  ): Promise<any>

  getByPath(dataSourceId: string, path: string): Promise<any>

  getBlueprint(typeRef: string): Promise<any>

  getById(
    dataSourceId: string,
    documentId: string,
    attribute?: string
  ): Promise<any>

  addToParent(dataSourceId: string, data: any): Promise<any>
}
