import React, { useContext } from 'react'
import { ApplicationContext, DynamicTable, formatDate } from '@dmt/common'
import { TAnalysis } from '../../../Types'
import { useParams } from 'react-router-dom'
import { DEFAULT_DATASOURCE_ID } from '../../../const'

const columns: Array<string> = [
  'Analysis name',
  'Description',
  'Created',
  'Updated',
  'Creator',
]

type TAnalysisRow = {
  _id?: string
  name: string
  description: string
  created: Date | string
  updated: Date | string
  creator: string
  index: number
  url: string
}

type TAnalysisTableProps = {
  analyses: TAnalysis[]
}

const onRowClicked = (event: any) => {
  //@ts-ignore
  document.location = event.target.parentElement.accessKey
}

export const AnalysisTable = (props: TAnalysisTableProps) => {
  const { analyses } = props
  const { data_source, entity_id } = useParams<{
    data_source: string
    entity_id: string
  }>()
  const settings = useContext(ApplicationContext)

  const getAccessUrl = (index: number, rowDocumentId: string): string => {
    const urlBase = `/${settings.urlPath}/view`

    if (data_source && entity_id) {
      // We're viewing an asset. Access the .analyses subdocuments
      return `${urlBase}/${data_source}/${entity_id}.analyses.${index}`
    }

    return `${urlBase}/${DEFAULT_DATASOURCE_ID}/${rowDocumentId}`
  }

  const rows: Array<TAnalysisRow> = []
  analyses?.forEach((analysis, index) => {
    const row: TAnalysisRow = {
      _id: analysis._id,
      name: analysis.label || analysis.name,
      description: analysis.description,
      created: formatDate(analysis.created),
      updated: formatDate(analysis.updated),
      creator: analysis.creator,
      index: index,
      url: getAccessUrl(index, analysis._id),
    }
    rows.push(row)
  })

  return (
    <DynamicTable columns={columns} rows={rows} onRowClicked={onRowClicked} />
  )
}
