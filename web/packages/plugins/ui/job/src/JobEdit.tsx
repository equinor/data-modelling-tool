import {
  EntityPickerButton,
  INPUT_FIELD_WIDTH,
  NewEntityButton,
  TReference,
  UIPluginSelector,
  EJobStatus,
  TJob,
} from '@dmt/common'
import * as React from 'react'
import { useState } from 'react'
import {
  Button,
  Input,
  Label,
  Typography,
  Tooltip,
} from '@equinor/eds-core-react'
import styled from 'styled-components'

const Column = styled.div``

const GroupWrapper = styled.div`
  & > * {
    padding-top: 8px;
  }
`

const HeaderWrapper = styled.div`
  margin-bottom: 50px;
  margin-top: 8px;
`

export const JobEdit = (props: {
  document: TJob
  updateDocument: Function
  documentId: string
  dataSourceId: string
}) => {
  const { document, documentId, dataSourceId, updateDocument } = props

  const [formData, setFormData] = useState<TJob>({ ...document })
  if (document.status !== EJobStatus.CREATED) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '30px',
        }}
      >
        <h4>Can't edit job parameters after job has been started</h4>
      </div>
    )
  }

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <HeaderWrapper>
          <Typography variant="h3">Input</Typography>
          <GroupWrapper>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
              }}
            >
              <Column>
                <Label label={'Input entity'} />
                <Tooltip
                  title={
                    formData.applicationInput.type || 'No input entity selected'
                  }
                  placement={'top-end'}
                >
                  <Input
                    style={{ cursor: 'pointer', width: INPUT_FIELD_WIDTH }}
                    type="string"
                    value={
                      formData?.applicationInput?.name ||
                      formData?.applicationInput?._id ||
                      ''
                    }
                    placeholder={
                      formData?.applicationInput?.name || 'Select or create'
                    }
                  />
                </Tooltip>
              </Column>
              <EntityPickerButton
                typeFilter={formData.applicationInput.type}
                onChange={(selectedEntity: any) => {
                  setFormData({
                    ...formData,
                    applicationInput: selectedEntity,
                  })
                }}
              />
              <NewEntityButton
                setReference={(createdEntity: TReference) => {
                  setFormData({
                    ...formData,
                    applicationInput: createdEntity,
                  })
                }}
              />
            </div>
            <div
              style={{
                margin: '10px 20px',
                borderLeft: '2px solid grey',
                paddingLeft: '10px',
              }}
            >
              {/*@ts-ignore*/}
              {Object.keys(formData.applicationInput?.input || {}).length ? (
                <UIPluginSelector
                  // @ts-ignore
                  type={formData.applicationInput.input.type}
                  // @ts-ignore
                  absoluteDottedId={`${dataSourceId}/${formData.applicationInput.input._id}`}
                  categories={['edit']}
                />
              ) : (
                <pre style={{ color: 'red' }}>
                  The jobs input object has no attribute named "input"
                </pre>
              )}
            </div>
          </GroupWrapper>
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
          <Button
            as="button"
            onClick={() => {
              updateDocument(formData, true)
            }}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}
