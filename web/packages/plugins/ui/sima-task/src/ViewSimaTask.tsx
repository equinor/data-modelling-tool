import React from 'react'
import { Card, Icon, Typography } from '@equinor/eds-core-react'
import styled from 'styled-components'
import { DmtUIPlugin } from '@dmt/common'

const Pre = styled.pre`
  font-size: 0.9em;
`

export const ViewSimaTask = (props: DmtUIPlugin): JSX.Element => {
  const { document: task } = props

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
              type: task.defaultInput.type,
              name: task.defaultInput.name,
              description: task.defaultInput.description,
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
