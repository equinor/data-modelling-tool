import React, { useEffect, useState } from 'react'
import { DmtUIPlugin, UIPluginSelector } from '@dmt/common'
import { AnalysisInfoCard, AnalysisJobTable } from '@dmt/analysis-platform'
import { TJob } from 'packages/plugins/apps/analysis-platform/src/Types'

export const ExpertView = (props: DmtUIPlugin): JSX.Element => {
  const { dataSourceId, document: analysis } = props
  const [jobs, setJobs] = useState<any[]>([])

  useEffect(() => {
    if (!analysis) return
    setJobs(analysis.jobs)
  }, [analysis])

  return (
    <>
      <AnalysisInfoCard
        analysis={analysis}
        addJob={(newJob: TJob) => setJobs([...jobs, newJob])}
        jobs={jobs}
      />
      <>
        <UIPluginSelector
          entity={analysis.task}
          absoluteDottedId={`${dataSourceId}/${analysis._id}.task`}
          categories={['container']}
        />
        <AnalysisJobTable jobs={jobs} analysisId={analysis._id} />
      </>
    </>
  )
}
