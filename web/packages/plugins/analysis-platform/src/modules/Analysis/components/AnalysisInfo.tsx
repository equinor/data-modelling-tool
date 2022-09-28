import React, { useContext } from 'react'
import { Button, Tooltip } from '@equinor/eds-core-react'
import Icons from '../../../components/Design/Icons'

import { AuthContext, hasExpertRole } from '@development-framework/dm-core'
import { TAnalysisInfoCardProps } from '../../../Types'
import { CreateJobButton } from './CreateJobButton'
import { DocumentInfoCard, OnRight } from '../../../components'

const AnalysisInfoCardActions = (props: TAnalysisInfoCardProps) => {
  const { analysis, addJob, jobs, dataSourceId } = props
  const { tokenData } = useContext(AuthContext)
  return (
    <>
      {Object.prototype.hasOwnProperty.call(analysis, 'task') &&
        Object.keys(analysis.task).length > 0 && (
          <>
            <CreateJobButton
              analysis={analysis}
              addJob={addJob}
              jobs={jobs}
              dataSourceId={dataSourceId}
            />
            {hasExpertRole(tokenData) && (
              <Tooltip title={'Not implemented'}>
                <Button style={{ width: 'max-content' }} disabled>
                  Configure schedule
                  <Icons name="time" title="time" />
                </Button>
              </Tooltip>
            )}
          </>
        )}
    </>
  )
}

export const AnalysisInfoCard = (props: TAnalysisInfoCardProps) => {
  const { analysis, addJob, jobs, dataSourceId } = props

  return (
    <>
      <OnRight>
        <DocumentInfoCard
          document={analysis}
          dataSourceId={dataSourceId}
          actions={
            <AnalysisInfoCardActions
              analysis={analysis}
              addJob={addJob}
              jobs={jobs}
              dataSourceId={dataSourceId}
            />
          }
        />
      </OnRight>
    </>
  )
}
