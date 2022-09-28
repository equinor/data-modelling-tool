import React, { useContext } from 'react'
import { DEFAULT_DATASOURCE_ID } from '../../../const'
import {
  DynamicTable,
  formatDate,
  ApplicationContext,
  TDmtSettings,
} from '@development-framework/dm-core'
import { TAsset } from '../../../Types'

const columns: Array<string> = [
  'Asset name',
  'Location',
  'Created',
  'Updated',
  'Contact',
]

type TAssetRow = {
  _id?: string
  name: string
  location?: string
  created: Date | string
  updated: Date | string
  contact?: string
  index: number
  url: string
}

type TAssetTableProps = {
  assets: TAsset[]
}

export const AssetTable = (props: TAssetTableProps) => {
  const { assets } = props
  const settings: TDmtSettings = useContext(ApplicationContext)

  const getViewUrl = (rowDocumentId: string): string =>
    `/${settings.urlPath}/view/${DEFAULT_DATASOURCE_ID}/${rowDocumentId}`

  const rows: Array<TAssetRow> = []
  assets?.forEach((asset: TAsset, index: number) => {
    const row: TAssetRow = {
      _id: asset._id,
      name: asset.label || asset.name,
      location: asset.location?.label || asset.location?.name || '',
      created: formatDate(asset.created),
      updated: formatDate(asset.updated),
      contact: asset.contact || '',
      index: index,
      url: getViewUrl(asset._id),
    }
    rows.push(row)
  })

  return <DynamicTable columns={columns} rows={rows} />
}
