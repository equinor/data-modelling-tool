import React, { useEffect, useState } from 'react'
import { DmtUIPlugin, TJob, useDocument } from '@dmt/common'
import { AnalysisInfoCard, AnalysisJobTable } from './components'

import { Loading } from '@dmt/common'

export const InspectorView = (props: DmtUIPlugin): JSX.Element => {
  const { documentId, dataSourceId } = props
  const [jobs, setJobs] = useState<any[]>([])
  const [document, loading, updateDocument] = useDocument(
    dataSourceId,
    documentId
  )
  const [analysis, setAnalysis] = useState<any>()

  useEffect(() => {
    if (!document) return
    setAnalysis(document)
  }, [document])

  useEffect(() => {
    if (!analysis) return
    setJobs(analysis.jobs)
  }, [analysis])
  if (loading) {
    return <Loading />
  }
  return (
    <>
      <AnalysisInfoCard
        analysis={analysis}
        addJob={(newJob: TJob) => false}
        jobs={jobs}
        dataSourceId={dataSourceId}
      />
      <AnalysisJobTable
        jobs={jobs}
        analysisId={analysis._id}
        dataSourceId={dataSourceId}
      />
    </>
  )
}
