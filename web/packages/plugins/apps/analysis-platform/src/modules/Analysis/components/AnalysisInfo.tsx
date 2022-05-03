import { Button } from '@equinor/eds-core-react'
import Icons from '../../../components/Design/Icons'
import React, { useState } from 'react'
import { TAnalysis, TTask } from '../Types'
import styled from 'styled-components'
import CreateAnalysisForm from './CreateAnalysisForm'
import AnalysisCard from './AnalysisCard'

const OnRight = styled.div`
  display: flex;
  margin-right: 50px;
`

type AnalysisInfoCardProps = {
  analysis: TAnalysis
  addJob: Function
  jobs: any
}

const AnalysisInfoCard = (props: AnalysisInfoCardProps) => {
  const { analysis, addJob, jobs } = props
  const [isEditing, setIsEditing] = useState<boolean>(false)

  const handleSubmitTask = (task: TTask) => {
    // TODO: Update task data inside analysis.
    setIsEditing(false)
  }

  return (
    <>
      {isEditing ? (
        <OnRight>
          <CreateAnalysisForm onSubmit={handleSubmitTask} data={analysis} />
          <Button onClick={() => setIsEditing(false)} variant="ghost_icon">
            <Icons name="close" title="close" />
          </Button>
        </OnRight>
      ) : (
        <OnRight>
          <AnalysisCard analysis={analysis} addJob={addJob} jobs={jobs} />
          <Button onClick={() => setIsEditing(true)} variant="ghost_icon">
            <Icons name="edit_text" title="edit_text" />
          </Button>
        </OnRight>
      )}
    </>
  )
}

export default AnalysisInfoCard