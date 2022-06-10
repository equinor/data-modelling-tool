import {
  DmtUIPlugin,
  PATH_INPUT_FIELD_WIDTH,
  Select,
  TContainerImage,
  useDocument,
  getFullContainerImageName,
  useSearch,
} from '@dmt/common'
import * as React from 'react'
import { ChangeEvent, useState } from 'react'
import {
  Button,
  CircularProgress,
  Progress,
  Typography,
} from '@equinor/eds-core-react'
import styled from 'styled-components'
import _ from 'lodash'

const Wrapper = styled.div`
  margin: 10px;
  width: 30vw;
`

const HeaderWrapper = styled.div`
  margin-bottom: 20px;
  width: 70%;
`

export const EditContainer = (props: DmtUIPlugin) => {
  const { document, dataSourceId, documentId, onSubmit } = props
  const [formData, setFormData] = useState<any>({ ...document })
  const [_document, loading, updateDocument] = useDocument(
    dataSourceId,
    documentId,
    false
  )
  const [containerImages, isLoading, hasError] = useSearch<TContainerImage>(
    {
      type: 'AnalysisPlatformDS/Blueprints/ContainerImage',
    },
    dataSourceId,
    '_id'
  )

  const getImageStoredInFormData = (
    images: TContainerImage[],
    formData: any
  ): string => {
    const image: TContainerImage | undefined = images.find(
      (image: TContainerImage) => {
        delete image['_id']
        delete image['uid']
        delete formData?.image['_id']
        return _.isEqual(image, formData?.image)
      }
    )
    if (image) {
      return JSON.stringify(image)
    } else {
      return ''
    }
  }

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', paddingTop: '50px' }}>
        <CircularProgress />
      </div>
    )
  }

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
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                console.log('parse res', JSON.parse(e.target.value))
                setFormData({ ...formData, image: JSON.parse(e.target.value) })
              }}
              value={getImageStoredInFormData(containerImages, formData)}
            >
              <option value={''} selected disabled hidden>
                Choose image...
              </option>
              {containerImages.map((image: TContainerImage, index: number) => {
                console.log('image as jsonstrign', JSON.stringify(image))
                return (
                  <option key={index} value={JSON.stringify(image)}>
                    {getFullContainerImageName(image)}
                  </option>
                )
              })}
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
            {loading ? (
              <Button>
                <Progress.Dots />
              </Button>
            ) : (
              <Button
                as="button"
                onClick={() => {
                  updateDocument(formData, true)
                  if (onSubmit) {
                    onSubmit(formData)
                  }
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
