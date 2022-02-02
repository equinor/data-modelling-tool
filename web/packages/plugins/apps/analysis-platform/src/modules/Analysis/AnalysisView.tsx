import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDocument } from '@dmt/common'
import OperationDetails from '../components/Operations/OperationDetails'
import AnalysisDetails from './AnalysisDetails'

export default (): JSX.Element => {
  const { data_source, entity_id } = useParams()
  const [analysis, isLoading, updateDocument, error] = useDocument(
    data_source,
    entity_id
  )
  if (!analysis) return <>Loading...</>

  return <AnalysisDetails analysis={analysis} />
}
