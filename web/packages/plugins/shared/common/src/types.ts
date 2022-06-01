export type TReference = {
  type: string
  _id: string
  name?: string
}

export type TBlob = {
  _blob_id: string
  name: string
  type: string
}

export type TLocation = {
  lat: number
  long: number
  name: string
  _id?: string
  type?: string
}

export type TContainerImage = {
  _id?: string
  uid?: string
  imageName: string
  description?: string
  type: string
  version: string
  registryName: string
}

export type DmtSettings = {
  name: string
  label: string
  tabIndex: number
  hidden: boolean
  visibleDataSources: any
  type: string
  description: string
  packages: any
  models: any
  actions: any
  file_loc: string
  data_source_aliases: any
  urlPath: string
}
