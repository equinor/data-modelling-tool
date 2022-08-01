import { EBlueprints } from '../../../Enums'
import { Progress } from '@equinor/eds-core-react'
import React from 'react'
import DynamicTable from '../../../components/DynamicTable'
import { DEFAULT_DATASOURCE_ID } from '../../../const'
import { formatDate } from '../../../utils/dateFormater'
import { useSearch } from '@dmt/common'
import { TAnalysis } from '../../../Types'

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

const onRowClicked = (event: any) => {
  const documentId = event.target.parentElement.accessKey
  document.location = `${document.location.pathname}/analysis/${DEFAULT_DATASOURCE_ID}/${documentId}`
}

export const AnalysisTable = () => {
  const [analysis, isLoading, hasError] = useSearch<TAnalysis>(
    {
      type: EBlueprints.ANALYSIS,
    },
    DEFAULT_DATASOURCE_ID
  )

  if (isLoading) {
    return <Progress.Linear />
  }

  const rows: Array<TAnalysisRow> = []
  analysis?.forEach((analysis) => {
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
