import React, { useEffect, useState } from 'react'
import { DmtUIPlugin, UIPluginSelector, TJob } from '@dmt/common'
import { AnalysisInfoCard, AnalysisJobTable } from './components'

export const OperatorView = (props: DmtUIPlugin): JSX.Element => {
  const { document, dataSourceId } = props
  const [jobs, setJobs] = useState<any[]>([])
  const [analysis, setAnalysis] = useState<any>({ ...document })

  useEffect(() => {
    if (!analysis) return
    setJobs(analysis.jobs)
  }, [analysis])

  useEffect(() => {
    //make sure local state is up to date with document prop
    setAnalysis(document)
  }, [document])

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
          onSubmit={(formData: any) => {
            setAnalysis({ ...analysis, task: formData })
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
