import React, { useEffect, useState, useContext } from 'react'
import { DmtUIPlugin, UIPluginSelector, TJob } from '@dmt/common'
import { AnalysisInfoCard, AnalysisJobTable } from './components'
import { hasDomainRole } from '@dmt/common'
import { AuthContext } from 'react-oauth2-code-pkce'

export const OperatorView = (props: DmtUIPlugin): JSX.Element => {
  const { document, dataSourceId } = props
  const [jobs, setJobs] = useState<any[]>([])
  const [analysis, setAnalysis] = useState<any>(document)
  const { tokenData } = useContext(AuthContext)

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
        {hasDomainRole(tokenData) && (
          <UIPluginSelector
            entity={analysis.task}
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
        />
      </>
    </>
  )
}
