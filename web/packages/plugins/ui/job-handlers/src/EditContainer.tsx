import {
  DmtUIPlugin,
  PATH_INPUT_FIELD_WIDTH,
  Select,
  useDocument,
} from '@dmt/common'
import * as React from 'react'
import { ChangeEvent, useState } from 'react'
import { Button, Typography } from '@equinor/eds-core-react'
import styled from 'styled-components'
import { TContainerImage } from '../../../apps/analysis-platform/src/Types'
import { getFullContainerImageName } from '../../../apps/analysis-platform/src/utils/GetFullContainerImageName'

const Wrapper = styled.div`
  margin: 10px;
  width: 30vw;
`

const HeaderWrapper = styled.div`
  margin-bottom: 20px;
  width: 70%;
`

export const EditContainer = (props: DmtUIPlugin) => {
  const { document, dataSourceId, documentId } = props
  const [formData, setFormData] = useState<any>({ ...document })
  const [_document, loading, updateDocument] = useDocument(
    dataSourceId,
    documentId,
    false
  )
  const imageOptions: TContainerImage[] = [
    {
      imageName: 'dmt-job/srs',
      type: 'AnalysisPlatformDS/Blueprints/ContainerImage',
      version: 'latest',
      registryName: 'datamodelingtool.azurecr.io',
    },
    {
      imageName: 'dmt-job/srs',
      type: 'AnalysisPlatformDS/Blueprints/ContainerImage',
      version: 'production',
      registryName: 'datamodelingtool.azurecr.io',
    },
  ]

  const findImageStoredInFormData = (
    images: TContainerImage[],
    formData: any
  ) => {
    const image: TContainerImage | undefined = images.find(
      (image: TContainerImage) => {
        return getFullContainerImageName(image) === formData?.image
      }
    )
    if (image) {
      return JSON.stringify(image)
    } else {
      return ''
    }
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
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setFormData({ ...formData, image: JSON.parse(e.target.value) })
              }
              value={findImageStoredInFormData(imageOptions, formData)}
            >
              <option value={''} selected disabled hidden>
                Choose image...
              </option>
              {imageOptions.map((image: TContainerImage, index: number) => (
                <option key={index} value={JSON.stringify(image)}>
                  {getFullContainerImageName(image)}
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
            <Button as="button" onClick={() => updateDocument(formData, true)}>
              Save
            </Button>
          </div>
        </Wrapper>
      </div>
    </div>
  )
}
