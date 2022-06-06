import React, { useEffect, useState } from 'react'
import { DmtUIPlugin, UIPluginSelector, TJob } from '@dmt/common'
import { AnalysisInfoCard, AnalysisJobTable } from './components'

export const OperatorView = (props: DmtUIPlugin): JSX.Element => {
  const { document: analysis, dataSourceId, onSubmit } = props
  const [jobs, setJobs] = useState<any[]>([])

  useEffect(() => {
    if (!analysis) return
    setJobs(analysis.jobs)
  }, [analysis])
  if (!onSubmit) {
    throw new Error(
      'OperatorView plugin must have an onSubmit function as props'
    )
  }

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
          onSubmit={() => {
            onSubmit()
          }}
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
