import { DmtUIPlugin, Select } from '@dmt/common'
import * as React from 'react'
import { ChangeEvent, useEffect, useState } from 'react'
import { Button, Typography } from '@equinor/eds-core-react'
import styled from 'styled-components'

const Wrapper = styled.div`
  margin: 10px;
  width: 30vw;
`

const HeaderWrapper = styled.div`
  margin-bottom: 20px;
  width: 70%;
`

export const EditContainer = (props: DmtUIPlugin) => {
  const { document, onSubmit, onChange } = props
  const [formData, setFormData] = useState<any>({ ...document })
  const imageOptions = ['datamodelingtool.azurecr.io/dmt-job/srs:latest']

  useEffect(() => {
    if (onChange) onChange(formData)
  }, [formData])

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          marginBottom: '10px',
        }}
      >
        <Wrapper>
          <HeaderWrapper>
            <Typography variant="h5">Container image</Typography>
            <Select
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setFormData({ ...formData, image: e.target.value })
              }
              value={formData?.image || null}
            >
              {imageOptions.map((image: string, index: number) => (
                <option key={index} value={image}>
                  {image}
                </option>
              ))}
            </Select>
          </HeaderWrapper>

          <div>
            {!onChange && ( // Only show button if no "onChange" function passed
              <Button
                as="button"
                onClick={() => {
                  //@ts-ignore
                  onSubmit(formData)
                }}
              >
                Save
              </Button>
            )}
          </div>
        </Wrapper>
      </div>
    </div>
  )
}
