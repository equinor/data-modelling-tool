import { DmtUIPlugin, useDocument } from '@dmt/common'
import * as React from 'react'
import { useEffect, useState } from 'react'
import {
  Button,
  SingleSelect,
  TextField,
  Typography,
} from '@equinor/eds-core-react'
import styled from 'styled-components'

const Wrapper = styled.div`
  margin: 10px;
  width: 30vw;
`

const HeaderWrapper = styled.div`
  margin-bottom: 20px;
  width: 70%;
`

export const EditLocalContainer = (props: DmtUIPlugin) => {
  const { document, documentId, dataSourceId, onSubmit } = props
  const [formData, setFormData] = useState<any>({ ...document })
  const [
    resultReferenceLocation,
    setResultReferenceLocation,
  ] = useState<string>('')
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false)
  const analysisId: string = documentId.split('.')[0] || 'NONE'
  const [analysisDocument, _loading, updateDocument, error] = useDocument(
    dataSourceId,
    analysisId
  )

  useEffect(() => {
    if (analysisDocument) {
      const analysisBlyeprint = 'AnalysisPlatformDS/Blueprints/Analysis'
      if (analysisDocument.type !== analysisBlyeprint) {
        throw new Error(
          `Edit local container UI plugin can only be used with an analysis entity of type ${analysisBlyeprint}`
        )
      }
      setResultReferenceLocation(
        `${analysisDocument._id}.jobs.${analysisDocument.jobs.length}.result`
      )
    }
  }, [analysisDocument])
  if (_loading) return <div>Loading...</div>
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
            <SingleSelect
              id="image"
              label={'Container image'}
              // value={formData.crUsername}
              placeholder="Image to run"
              items={['wrapper']}
              handleSelectedItemChange={(selected) => {
                setUnsavedChanges(true)
                setFormData({ ...formData, image: selected.inputValue })
              }}
            />
          </HeaderWrapper>
          <HeaderWrapper>
            <Typography variant="h5">Command list</Typography>
            <SingleSelect
              id="command_list"
              label={'Command list to container'}
              // value={formData.crUsername}
              placeholder="Command"
              items={[
                `/code/init.sh;--result-reference-location=${resultReferenceLocation}`,
              ]}
              handleSelectedItemChange={(selected) => {
                setUnsavedChanges(true)
                setFormData({
                  ...formData,
                  //@ts-ignore
                  command: selected.inputValue.split(';'),
                })
              }}
            />
          </HeaderWrapper>

          <div>
            <Button
              as="button"
              onClick={() => {
                setUnsavedChanges(false)
                //@ts-ignore
                onSubmit(formData)
              }}
            >
              Save
            </Button>
            {unsavedChanges && <p>* Unsaved changes</p>}
          </div>
        </Wrapper>
      </div>
    </div>
  )
}
