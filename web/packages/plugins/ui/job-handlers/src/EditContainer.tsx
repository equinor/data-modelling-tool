import {
  DmtUIPlugin,
  PATH_INPUT_FIELD_WIDTH,
  Select,
  useDocument,
} from '@dmt/common'
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
  const { document, dataSourceId, documentId, entityUpdatedInDatabase } = props
  const [formData, setFormData] = useState<any>({ ...document })
  const [updateDatabase, setUpdateDatabase] = useState<boolean>(false)
  const [_document, _loading, updateDocument] = useDocument(
    dataSourceId,
    documentId,
    false
  )
  const imageOptions = [
    'datamodelingtool.azurecr.io/dmt-job/srs:latest',
    'datamodelingtool.azurecr.io/dmt-job/srs:production',
  ]

  if (!entityUpdatedInDatabase) {
    console.error(
      'Cannot use the EditTask UI plugin without defining entityUpdatedInDatabase prop'
    )
    return <div></div>
  }

  useEffect(() => {
    if (!_loading && updateDatabase) {
      entityUpdatedInDatabase()
      setUpdateDatabase(false)
    }
  }, [_loading])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          marginBottom: '10px',
          marginTop: '10px',
        }}
      >
        <Wrapper>
          <HeaderWrapper>
            <Typography variant="h5">Container image</Typography>
            <Select
              style={{ width: PATH_INPUT_FIELD_WIDTH }}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setFormData({ ...formData, image: e.target.value })
              }
              value={imageOptions.find(
                (image: string) => image === formData?.image
              )}
            >
              <option value={''} selected disabled hidden>
                Choose image...
              </option>
              {imageOptions.map((image: string, index: number) => (
                <option key={index} value={image}>
                  {image}
                </option>
              ))}
            </Select>
          </HeaderWrapper>
          {/*<HeaderWrapper>*/}
          {/*  <Typography variant="h5">*/}
          {/*    Custom command (Not implemented)*/}
          {/*  </Typography>*/}
          {/*  <Select*/}
          {/*    disabled={true}*/}
          {/*    onChange={(e: ChangeEvent<HTMLSelectElement>) =>*/}
          {/*      setFormData({ ...formData, customCommand: e.target.value })*/}
          {/*    }*/}
          {/*    value={formData?.customCommand || null}*/}
          {/*  ></Select>*/}
          {/*</HeaderWrapper>*/}
          {/*<HeaderWrapper>*/}
          {/*  <Typography variant="h5">*/}
          {/*    Environment variable list (not implemented)*/}
          {/*  </Typography>*/}
          {/*  <Select*/}
          {/*    disabled={true}*/}
          {/*    onChange={(e: ChangeEvent<HTMLSelectElement>) =>*/}
          {/*      setFormData({*/}
          {/*        ...formData,*/}
          {/*        environmentVariables: e.target.value,*/}
          {/*      })*/}
          {/*    }*/}
          {/*    value={formData?.environmentVariables || null}*/}
          {/*  ></Select>*/}
          {/*</HeaderWrapper>*/}

          <div>
            <Button
              as="button"
              onClick={() => {
                updateDocument(formData, true)
                setUpdateDatabase(true)
              }}
            >
              Save
            </Button>
          </div>
        </Wrapper>
      </div>
    </div>
  )
}
