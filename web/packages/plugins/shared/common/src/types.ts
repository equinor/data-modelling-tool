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
  imageName: string
  description?: string
  type: string
  version: string
  registryName: string
}
