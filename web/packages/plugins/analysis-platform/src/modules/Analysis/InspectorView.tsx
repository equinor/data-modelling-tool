import React, { useEffect, useState } from 'react'
import { IDmtUIPlugin, TJob, useDocument } from '@development-framework/dm-core'
import { AnalysisInfoCard, AnalysisJobTable } from './components'

import { Loading } from '@development-framework/dm-core'

export const InspectorView = (props: IDmtUIPlugin): JSX.Element => {
  const { documentId, dataSourceId } = props
  const [jobs, setJobs] = useState<any[]>([])
  const [document, loading] = useDocument(dataSourceId, documentId)
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        addJob={(newJob: TJob) => false}
        jobs={jobs}
        dataSourceId={dataSourceId}
      />
      <AnalysisJobTable
        jobs={jobs}
        analysisId={analysis._id}
        dataSourceId={dataSourceId}
        setJobs={() => undefined}
      />
    </>
  )
}
