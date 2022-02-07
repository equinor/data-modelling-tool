import { TAnalysis, TTask } from '../Types'
import React, { useContext, useState } from 'react'
import AnalysisTaskTable from './AnalysisTaskTable'
import EditTaskForm from './EditTaskForm'
import Icons from '../../../components/Design/Icons'
import { Button } from '@equinor/eds-core-react'
import styled from 'styled-components'

type AnalysisTaskCardProps = {
  analysis: TAnalysis
}

const OnRight = styled.div`
  display: flex;
  flex-direction: row-reverse;
  margin-right: 50px;
`

const AnalysisTaskCard = (props: AnalysisTaskCardProps) => {
  const { analysis } = props
  const [isEditing, setIsEditing] = useState<boolean>(false)

  const handleSubmitTask = (task: TTask) => {
    // TODO: Update task data inside analysis.
    setIsEditing(false)
  }

  return (
    <>
      <OnRight>
        <Button onClick={() => setIsEditing(!isEditing)} variant="outlined">
          Edit
          <Icons name="edit_text" title="edit_text" />
        </Button>
      </OnRight>
      {isEditing ? (
        <EditTaskForm
          onSubmit={handleSubmitTask}
          task={analysis.workflow.tasks[0]}
        />
      ) : (
        <AnalysisTaskTable analysis={analysis} />
      )}
    </>
  )
}

export default AnalysisTaskCard
