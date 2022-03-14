import { DmtUIPlugin } from '@dmt/common'
import * as React from 'react'
import { ChangeEvent, useEffect, useState } from 'react'
import { Button, TextField, Typography } from '@equinor/eds-core-react'
import styled from 'styled-components'

const Wrapper = styled.div`
  margin: 10px;
`

const HeaderWrapper = styled.div`
  margin-bottom: 20px;
`

export const EditAzureContainer = (props: DmtUIPlugin) => {
  const { document, onSubmit, onChange } = props
  const [formData, setFormData] = useState<any>({ ...document })

  useEffect(() => {
    if (onChange) onChange(formData)
  }, [formData])

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
              value={formData.image}
              placeholder="Image to run"
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, image: event.target.value })
              }
              style={{ maxWidth: '550px' }}
            />
          </HeaderWrapper>

          {onChange === undefined && (
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
          )}
        </Wrapper>
      </div>
    </div>
  )
}
