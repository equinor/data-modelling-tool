import React, { useEffect, useState } from 'react'
import {
  DmtUIPlugin,
  UIPluginSelector,
  TJob,
  useDocument,
  Loading,
} from '@dmt/common'
import { AnalysisInfoCard, AnalysisJobTable } from './components'

export const OperatorView = (props: DmtUIPlugin): JSX.Element => {
  const { documentId, dataSourceId } = props
  const [jobs, setJobs] = useState<any[]>([])
  const [analysis, setAnalysis] = useState<any>()
  const [document, loading, updateDocument] = useDocument(
    dataSourceId,
    documentId
  )

  useEffect(() => {
    if (!analysis) return
    setJobs(analysis.jobs)
  }, [analysis])

  useEffect(() => {
    setAnalysis(document)
  }, [document])
  if (loading) {
    return <Loading />
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
          type={analysis.task.type}
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
