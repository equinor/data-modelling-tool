import React from 'react'
import { DynamicTable, formatDate } from '@dmt/common'
import { TAnalysis } from '../Types'

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
}

type TAnalysisTableProps = {
  analyses: TAnalysis[]
}

const onRowClicked = (event: any) => {
  const index = event.target.parentElement.tabIndex
  //@ts-ignore
  document.location = `${document.location.pathname}.analyses.${index}`
}

export const AnalysisTable = (props: TAnalysisTableProps) => {
  const { analyses } = props

  const rows: Array<TAnalysisRow> = []
  analyses?.forEach((analysis) => {
    const row: TAnalysisRow = {
      _id: analysis._id,
      name: analysis.label || analysis.name,
      description: analysis.description,
      created: formatDate(analysis.created),
      updated: formatDate(analysis.updated),
      creator: analysis.creator,
    }
    rows.push(row)
  })

  return (
    <DynamicTable columns={columns} rows={rows} onRowClicked={onRowClicked} />
  )
}
