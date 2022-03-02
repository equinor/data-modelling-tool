import React, { useContext } from 'react'
import { useParams } from 'react-router-dom'
import { AuthContext, DmtAPI, UIPluginSelector, useDocument } from '@dmt/common'
import AnalysisChooser from './components/AnalysisChooser'
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
  // @ts-ignore
  const { token } = useContext(AuthContext)

  function addJob(newJob: any) {
    // TODO:
    console.log('New job added to state')
  }

  if (isLoading) return <Progress.Linear />
  return (
    <>
      <AnalysisInfoCard analysis={analysis} addJob={addJob} />
      <>
        <UIPluginSelector
          entity={analysis.task}
          absoluteDottedId={`${data_source}/${analysis._id}.task`}
        />
        <AnalysisJobTable analysis={analysis} />
      </>
    </>
  )
}
