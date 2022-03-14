import { DmtUIPlugin } from '@dmt/common'
import * as React from 'react'
import { ChangeEvent, useState } from 'react'
import {
  Button,
  SingleSelect,
  TextField,
  Typography,
} from '@equinor/eds-core-react'
import styled from 'styled-components'

const Wrapper = styled.div`
  margin: 10px;
`

const HeaderWrapper = styled.div`
  margin-bottom: 20px;
`

export const EditLocalContainer = (props: DmtUIPlugin) => {
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
          <HeaderWrapper style={{ width: '70%' }}>
            <Typography variant="h5">Container image</Typography>
            <SingleSelect
              id="image"
              label={'Container image'}
              // value={formData.crUsername}
              placeholder="Image to run"
              items={['alpine']}
              handleSelectedItemChange={selected =>
                setFormData({ ...formData, image: selected.inputValue })
              }
              // onChange={(event: ChangeEvent<HTMLInputElement>) =>
              //   setFormData({ ...formData, image: event.target.value })
              // }
            />
          </HeaderWrapper>
          <HeaderWrapper style={{ width: '70%' }}>
            <Typography variant="h5">Command</Typography>
            <SingleSelect
              id="command"
              label={'Command to run'}
              // value={formData.crUsername}
              placeholder="Command for the container (parameters)"
              items={['ls', 'echo 123']}
              handleSelectedItemChange={selected =>
                setFormData({ ...formData, command: selected.inputValue })
              }
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
