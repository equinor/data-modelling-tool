export type DataSource = {
  id: string
  name: string
  type?: string
  host?: string
}
export interface DataSources extends Array<DataSource> {}
