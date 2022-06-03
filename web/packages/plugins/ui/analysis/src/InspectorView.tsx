import React, { useEffect, useState } from 'react'
import { DmtUIPlugin, TJob } from '@dmt/common'
import { AnalysisInfoCard, AnalysisJobTable } from './components'

export const InspectorView = (props: DmtUIPlugin): JSX.Element => {
  const { document: analysis, dataSourceId } = props
  const [jobs, setJobs] = useState<any[]>([])

  useEffect(() => {
    if (!analysis) return
    setJobs(analysis.jobs)
  }, [analysis])

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
