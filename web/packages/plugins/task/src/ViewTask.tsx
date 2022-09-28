import React from 'react'
import { Card, Icon, Typography } from '@equinor/eds-core-react'
import styled from 'styled-components'
import {
  IDmtUIPlugin,
  Loading,
  useDocument,
} from '@development-framework/dm-core'

const Pre = styled.pre`
  font-size: 0.9em;
`

export const ViewTask = (props: IDmtUIPlugin): JSX.Element => {
  const { documentId, dataSourceId } = props

  const [task, loading] = useDocument<any>(dataSourceId, documentId)
  if (loading) {
    return <Loading />
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h5">{task.name}</Typography>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Pre>
          {JSON.stringify(
            {
              type: task?.input?.type,
              name: task?.input?.name,
              description: task?.input?.description,
              ['...']: '...',
            },
            null,
            2
          )}
        </Pre>
        <Icon name="arrow_forward" size={40} />
        <Card
          style={{
            border: 'black solid 1.5px',
            maxWidth: '300px',
            backgroundColor: '#9fd5d5',
          }}
        >
          <Card.Header>
            <Card.HeaderTitle>
              <Typography variant="overline">{task.type}</Typography>
              <Typography variant="h5">{task.name}</Typography>
              <Typography variant="body_short">{task.description}</Typography>
            </Card.HeaderTitle>
          </Card.Header>
        </Card>
        <Icon name="arrow_forward" size={40} />
        <Pre>
          {JSON.stringify(
            {
              type: task.outputType,
              ['...']: '...',
            },
            null,
            2
          )}
        </Pre>
      </div>
    </>
  )
}
