import { DmtUIPlugin } from '@dmt/common'
import * as React from 'react'
import { ChangeEvent, useState } from 'react'
import { Button, TextField, Typography } from '@equinor/eds-core-react'
import styled from 'styled-components'

const Wrapper = styled.div`
  margin: 10px;
`

const HeaderWrapper = styled.div`
  margin-bottom: 20px;
`

export const EditAzureContainer = (props: DmtUIPlugin) => {
  const { document, documentId, dataSourceId, onSubmit } = props
  const [formData, setFormData] = useState<any>({ ...document })

  return (
    <div
      style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}
    >
      <div
        style={{
          maxWidth: '900px',
          width: '100%',
          marginBottom: '10px',
          width: '-webkit-fill-available',
        }}
      >
        <Wrapper>
          <HeaderWrapper>
            <Typography variant="h5">Container image</Typography>
            <TextField
              id="image"
              label={'Container image'}
              value={formData.crUsername}
              placeholder="Image to run"
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, image: event.target.value })
              }
              style={{ maxWidth: '550px' }}
            />
          </HeaderWrapper>
          <HeaderWrapper>
            <Typography variant="h5">Command</Typography>
            <TextField
              id="command"
              label={'Registry username'}
              value={formData.crUsername}
              placeholder="Command for the container (parameters)"
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, command: event.target.value })
              }
              style={{ maxWidth: '550px' }}
            />
          </HeaderWrapper>
          <HeaderWrapper>
            <Typography variant="h5">Environment variables</Typography>
            <TextField
              id="variables"
              label={'Environment variables'}
              value={formData.environmentVariables}
              placeholder="Env vars to feed the container"
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setFormData({
                  ...formData,
                  environmentVariables: event.target.value,
                })
              }
              style={{ maxWidth: '550px' }}
            />
          </HeaderWrapper>

          <HeaderWrapper>
            <Typography variant="h5">Container registry username</Typography>
            <TextField
              id="cr-username"
              label={'Registry username'}
              value={formData.crUsername}
              placeholder="Username for image registry authentication"
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, crUsername: event.target.value })
              }
              style={{ maxWidth: '550px' }}
            />
          </HeaderWrapper>
          <HeaderWrapper>
            <Typography variant="h5">Azure Location</Typography>
            <TextField
              id="location"
              label={'Azure location'}
              value={formData.azureLocation}
              placeholder="Datacenter location to run job"
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, azureLocation: event.target.value })
              }
              style={{ maxWidth: '550px' }}
            />
          </HeaderWrapper>
          <HeaderWrapper>
            <Typography variant="h5">Compute power</Typography>
            <TextField
              id="computePower"
              label={'Compute power'}
              value={formData.computePower}
              placeholder="CPU resources for the container"
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, computePower: event.target.value })
              }
              style={{ maxWidth: '550px' }}
            />
          </HeaderWrapper>

          <div style={{ justifyContent: 'space-around', display: 'flex' }}>
            <Button
              as="button"
              variant="outlined"
              color="danger"
              onClick={() => setFormData({ ...document })}
            >
              Reset
            </Button>
            <Button as="button" onClick={() => onSubmit(formData)}>
              Ok
            </Button>
          </div>
        </Wrapper>
      </div>
    </div>
  )
}
