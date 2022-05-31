import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { UIPluginSelector, useDocument } from '@dmt/common'
import { Progress } from '@equinor/eds-core-react'
import AnalysisInfoCard from './components/AnalysisInfo'
import AnalysisJobTable from './components/AnalysisJobTable'
import { TAnalysis, TJob } from '../../Types'

export default (): JSX.Element => {
  // @ts-ignore
  const { data_source, entity_id } = useParams<{
    data_source: string
    entity_id: string
  }>()
  const [
    analysis,
    isLoading,
    updateDocument,
    error,
    fetchDocument,
  ] = useDocument<TAnalysis>(data_source, entity_id, true)
  const [jobs, setJobs] = useState<any[]>([])

  useEffect(() => {
    if (!analysis) return
    setJobs(analysis.jobs)
  }, [analysis])
  if (error)
    return (
      <pre style={{ color: 'red' }}>
        {JSON.stringify(error.message, null, 2)}
      </pre>
    )
  if (isLoading || !analysis) return <Progress.Linear />

  const handleEntityUpdated = () => {
    fetchDocument()
  }

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
          entityUpdatedInDatabase={handleEntityUpdated}
          absoluteDottedId={`${data_source}/${analysis._id}.task`}
          categories={['container']}
        />
        <AnalysisJobTable jobs={jobs} analysisId={analysis._id} />
      </>
    </>
  )
}
