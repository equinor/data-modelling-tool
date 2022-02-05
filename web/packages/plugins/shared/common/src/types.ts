export type TReference = {
  name: string
  type: string
  _id: string
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
