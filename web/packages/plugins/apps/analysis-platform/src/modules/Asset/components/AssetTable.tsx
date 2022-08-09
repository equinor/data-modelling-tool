import { EBlueprints } from '../../../Enums'
import { Progress } from '@equinor/eds-core-react'
import React from 'react'
import { DEFAULT_DATASOURCE_ID } from '../../../const'
import { DynamicTable, useSearch, formatDate } from '@dmt/common'
import { TAsset } from '../../../Types'

const columns: Array<string> = [
  'Asset name',
  'Location',
  'Created',
  'Updated',
  'Responsible',
]

type TAssetRow = {
  _id?: string
  name: string
  location?: string
  created: Date | string
  updated: Date | string
  responsible?: string
}

const onRowClicked = (event: any) => {
  const documentId = event.target.parentElement.accessKey
  //@ts-ignore
  document.location = `${document.location.pathname}/view/${DEFAULT_DATASOURCE_ID}/${documentId}`
}

export const AssetTable = () => {
  const [assets, isLoading] = useSearch<TAsset>(
    {
      type: EBlueprints.ASSET,
    },
    DEFAULT_DATASOURCE_ID
  )

  if (isLoading) {
    return <Progress.Linear />
  }

  const rows: Array<TAssetRow> = []
  assets?.forEach((asset) => {
    const row: TAssetRow = {
      _id: asset._id,
      name: asset.label || asset.name,
      location: asset.location?.label || asset.location?.name || '',
      created: formatDate(asset.created),
      updated: formatDate(asset.updated),
      responsible: asset.responsible || '',
    }
    rows.push(row)
  })

  return (
    <DynamicTable columns={columns} rows={rows} onRowClicked={onRowClicked} />
  )
}
