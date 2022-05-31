import React, { useEffect, useState } from 'react'
import { DmtUIPlugin } from '@dmt/common'
import { AnalysisInfoCard, AnalysisJobTable } from '@dmt/analysis-platform'
import { TJob } from 'packages/plugins/apps/analysis-platform/src/Types'

export const OperatorView = (props: DmtUIPlugin): JSX.Element => {
  const { document: analysis } = props
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
      />
      <AnalysisJobTable jobs={jobs} analysisId={analysis._id} />
    </>
  )
}
