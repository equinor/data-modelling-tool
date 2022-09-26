import {
  IDmtUIPlugin,
  PATH_INPUT_FIELD_WIDTH,
  Select,
  TContainerImage,
  useDocument,
  getFullContainerImageName,
  useSearch,
  Loading,
} from '@development-framework/dm-core'
import * as React from 'react'
import { ChangeEvent, useEffect, useState } from 'react'
import { Button, Progress, Typography } from '@equinor/eds-core-react'
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

export const EditContainer = (props: IDmtUIPlugin) => {
  const { dataSourceId, documentId, onSubmit } = props
  const [formData, setFormData] = useState<any>()
  const [document, loadingDocument, updateDocument] = useDocument(
    dataSourceId,
    documentId,
    999
  )
  const [containerImages, loadingImages] = useSearch<TContainerImage>(
    {
      type: 'AnalysisPlatformDS/Blueprints/ContainerImage',
    },
    dataSourceId,
    '_id'
  )

  useEffect(() => {
    if (!document) return
    setFormData(document)
  }, [document])

  const getImageStoredInFormData = (
    images: TContainerImage[],
    formData: any
  ): string => {
    if (!formData?.image) {
      return ''
    }
    const image: TContainerImage | undefined = images.find(
      (image: TContainerImage) => {
        delete image['_id']
        delete image['uid']
        delete formData?.image['_id']
        delete formData?.image['uid']
        return _.isEqual(image, formData?.image)
      }
    )
    if (image) {
      return JSON.stringify(image)
    } else {
      return ''
    }
  }
  if (loadingDocument || loadingImages) {
    return <Loading />
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
                setFormData({ ...formData, image: JSON.parse(e.target.value) })
              }}
              value={getImageStoredInFormData(containerImages, formData)}
            >
              <option value={''} selected disabled hidden>
                Choose image...
              </option>
              {containerImages.map((image: TContainerImage, index: number) => {
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

          <div style={{ flexDirection: 'row' }}>
            {loadingDocument ? (
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
                {!_.isEqual(document, formData) ? 'Save *' : 'Save'}
              </Button>
            )}
          </div>
        </Wrapper>
      </div>
    </div>
  )
}
