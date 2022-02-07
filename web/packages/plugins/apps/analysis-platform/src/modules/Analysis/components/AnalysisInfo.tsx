import {
  Button,
  Card,
  Label,
  Progress,
  Typography,
} from '@equinor/eds-core-react'
import { hasExpertRole } from '../../../utils/auth'
import Icons from '../../../components/Design/Icons'
import React, { useContext, useState } from 'react'
import { TAnalysis, TTask } from '../Types'
import { CustomScrim } from '../../../components/CustomScrim'
import { AccessControlList, AuthContext, DmssAPI } from '@dmt/common'
import { DEFAULT_DATASOURCE_ID } from '../../../const'
import styled from 'styled-components'
import { edit_text } from '@equinor/eds-icons'
import JobApi from '../../Jobs/JobApi'
import { NotificationManager } from 'react-notifications'
import EditTaskForm from './EditTaskForm'
import AnalysisTaskTable from './AnalysisTaskTable'
import CreateAnalysisForm from './CreateAnalysisForm'
import AnalysisCard from './AnalysisCard'

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
`
const CardWrapper = styled.div`
  height: auto;
  width: 400px;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: repeat(2, 320px);
  grid-gap: 32px 32px;
  border-radius: 5px;
`

const OnRight = styled.div`
  display: flex;
  flex-direction: row-reverse;
  margin-right: 50px;
`

type AnalysisInfoCardProps = {
  analysis: TAnalysis
}

const AnalysisInfoCard = (props: AnalysisInfoCardProps) => {
  const { analysis } = props
  const [viewACL, setViewACL] = useState<boolean>(false)
  const { tokenData } = useContext(AuthContext)
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
        <CreateAnalysisForm onSubmit={handleSubmitTask} data={analysis} />
      ) : (
        <AnalysisCard analysis={analysis} />
      )}
    </>
  )
}

export default AnalysisInfoCard
