import React, { useEffect, useState } from 'react'
import { DmtUIPlugin, UIPluginSelector, TJob } from '@dmt/common'
import { AnalysisInfoCard, AnalysisJobTable } from './components'

export const ExpertView = (props: DmtUIPlugin): JSX.Element => {
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
        addJob={(newJob: TJob) => setJobs([...jobs, newJob])}
        jobs={jobs}
        dataSourceId={dataSourceId}
      />
      <>
        <UIPluginSelector
          entity={analysis.task}
          absoluteDottedId={`${dataSourceId}/${analysis._id}.task`}
          categories={['container']}
        />
        <AnalysisJobTable
          jobs={jobs}
          analysisId={analysis._id}
          dataSourceId={dataSourceId}
        />
      </>
    </>
  )
}
