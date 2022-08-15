import { EBlueprints } from '../../../Enums'
import { Progress } from '@equinor/eds-core-react'
import React, { useContext } from 'react'
import { DEFAULT_DATASOURCE_ID } from '../../../const'
import {
  DynamicTable,
  useSearch,
  formatDate,
  ApplicationContext,
} from '@dmt/common'
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

const onRowClicked = (event: any) => {
  //@ts-ignore
  document.location = event.target.parentElement.accessKey
}

export const AssetTable = () => {
  const [assets, isLoading] = useSearch<TAsset>(
    {
      type: EBlueprints.ASSET,
    },
    DEFAULT_DATASOURCE_ID
  )
  const settings = useContext(ApplicationContext)

  const getAccessUrl = (rowDocumentId: string): string =>
    `/${settings.urlPath}/view/${DEFAULT_DATASOURCE_ID}/${rowDocumentId}`

  if (isLoading) {
    return <Progress.Linear />
  }

  const rows: Array<TAssetRow> = []
  assets?.forEach((asset, index) => {
    const row: TAssetRow = {
      _id: asset._id,
      name: asset.label || asset.name,
      location: asset.location?.label || asset.location?.name || '',
      created: formatDate(asset.created),
      updated: formatDate(asset.updated),
      contact: asset.contact || '',
      index: index,
      url: getAccessUrl(asset._id),
    }
    rows.push(row)
  })

  return (
    <DynamicTable columns={columns} rows={rows} onRowClicked={onRowClicked} />
  )
}
