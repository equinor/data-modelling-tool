import React, { useContext } from 'react'
import { useParams } from 'react-router-dom'
import { AuthContext, DmtAPI, UIPluginSelector, useDocument } from '@dmt/common'
import AnalysisChooser from './components/AnalysisChooser'
import { Progress } from '@equinor/eds-core-react'
import { TAnalysis } from './Types'
import { Blueprints } from '../../Enums'
import AnalysisInfoCard from './components/AnalysisInfo'
import AnalysisJobTable from './components/AnalysisJobTable'

const hasDefinedTask = (analysis: TAnalysis) =>
  'workflow' in analysis && 'tasks' in analysis.workflow

export default (): JSX.Element => {
  // @ts-ignore
  const { data_source, entity_id } = useParams()
  const [analysis, isLoading, updateDocument, error] = useDocument(
    data_source,
    entity_id
  )
  // @ts-ignore
  const { token } = useContext(AuthContext)

  if (isLoading) return <Progress.Linear />

  const handleTypeSelected = (type: string) => {
    const dmtAPI = new DmtAPI()
    dmtAPI
      .createEntity(`WorkflowDS/Blueprints/tasks/${type}`, token)
      .then((instance: any) => {
        // Update analysis with selected task type
        const updatedAnalysis = {
          ...analysis,
          workflow: {
            type: Blueprints.WORKFLOW,
            tasks: [instance],
          },
        }
        updateDocument(updatedAnalysis)
      })
  }

  return (
    <>
      <AnalysisInfoCard analysis={analysis} />
      {hasDefinedTask(analysis) ? (
        <>
          <UIPluginSelector
            entity={analysis.workflow.tasks[0]}
            absoluteDottedId={`${data_source}/${analysis._id}.workflow.tasks.0`}
          />
          <AnalysisJobTable analysis={analysis} />
        </>
      ) : (
        <AnalysisChooser onSelectType={handleTypeSelected} />
      )}
    </>
  )
}
