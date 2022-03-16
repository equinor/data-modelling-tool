import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AuthContext, UIPluginSelector, useDocument } from '@dmt/common'
import { Progress } from '@equinor/eds-core-react'
import AnalysisInfoCard from './components/AnalysisInfo'
import AnalysisJobTable from './components/AnalysisJobTable'

export default (): JSX.Element => {
  // @ts-ignore
  const { data_source, entity_id } = useParams()
  const [analysis, isLoading, updateDocument, error] = useDocument(
    data_source,
    entity_id
  )
  const [jobs, setJobs] = useState<any[]>([])

  useEffect(() => {
    if (!analysis) return
    setJobs(analysis.jobs)
  }, [analysis])

  function addJob(newJob: any) {
    setJobs([...jobs, newJob])
    console.log('New job added to state')
  }

  if (isLoading) return <Progress.Linear />
  return (
    <>
      <AnalysisInfoCard analysis={analysis} addJob={addJob} jobs={jobs} />
      <>
        <UIPluginSelector
          entity={analysis.task}
          absoluteDottedId={`${data_source}/${analysis._id}.task`}
          categories={['container', 'view']}
        />
        <AnalysisJobTable jobs={jobs} analysisId={analysis._id} />
      </>
    </>
  )
}
