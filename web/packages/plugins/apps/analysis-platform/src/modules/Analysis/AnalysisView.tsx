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

  const handleTypeSelected = (type: string) => {
    const dmtAPI = new DmtAPI()
    dmtAPI
      .createEntity(`WorkflowDS/Blueprints/tasks/${type}`, token)
      .then((instance: any) => {
        // Update analysis with selected task type
        const updatedAnalysis = {
          ...analysis,
          task: instance,
        }
        updateDocument(updatedAnalysis)
      })
  }

  if (isLoading) return <Progress.Linear />
  return (
    <>
      <AnalysisInfoCard analysis={analysis} addJob={addJob} />
      {'task' in analysis && Object.keys(analysis.task).length ? (
        <>
          <UIPluginSelector
            entity={analysis.task}
            absoluteDottedId={`${data_source}/${analysis._id}.task`}
          />
          <AnalysisJobTable analysis={analysis} />
        </>
      ) : (
        <AnalysisChooser onSelectType={handleTypeSelected} />
      )}
    </>
  )
}
