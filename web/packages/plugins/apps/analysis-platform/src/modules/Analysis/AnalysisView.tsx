import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AuthContext, UIPluginSelector, useDocument } from '@dmt/common'
import { Progress } from '@equinor/eds-core-react'
import AnalysisInfoCard from './components/AnalysisInfo'
import AnalysisJobTable from './components/AnalysisJobTable'
import { TJob } from '../../Types'

export default (): JSX.Element => {
  // @ts-ignore
  const { data_source, entity_id } = useParams<{
    data_source: string
    entity_id: string
  }>()
  const [analysis, isLoading, updateDocument, error] = useDocument(
    data_source,
    entity_id
  )
  const [jobs, setJobs] = useState<any[]>([])

  useEffect(() => {
    if (!analysis) return
    setJobs(analysis.jobs)
  }, [analysis])

  if (isLoading) return <Progress.Linear />
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
          absoluteDottedId={`${data_source}/${analysis._id}.task`}
          categories={['container', 'view']}
        />
        <AnalysisJobTable jobs={jobs} analysisId={analysis._id} />
      </>
    </>
  )
}
