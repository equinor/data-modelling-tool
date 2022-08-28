import React, { useEffect, useState, useContext } from 'react'
import {
  DmtUIPlugin,
  UIPluginSelector,
  TJob,
  useDocument,
  Loading,
  hasDomainRole,
} from '@data-modelling-tool/core'
import { AnalysisInfoCard, AnalysisJobTable } from './components'
import { AuthContext } from 'react-oauth2-code-pkce'

export const OperatorView = (props: DmtUIPlugin): JSX.Element => {
  const { documentId, dataSourceId } = props
  const [jobs, setJobs] = useState<any[]>([])
  const [analysis, setAnalysis] = useState<any>()
  const [document, loading] = useDocument(dataSourceId, documentId)
  // @ts-ignore
  const { tokenData } = useContext(AuthContext)

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
        {hasDomainRole(tokenData) && (
          <UIPluginSelector
            type={analysis.task.type}
            absoluteDottedId={`${dataSourceId}/${analysis._id}.task`}
            categories={['container']}
            onSubmit={(formData: any) => {
              setAnalysis({ ...analysis, task: formData })
            }}
          />
        )}
        <AnalysisJobTable
          jobs={jobs}
          analysisId={analysis._id}
          dataSourceId={dataSourceId}
          setJobs={setJobs}
        />
      </>
    </>
  )
}
