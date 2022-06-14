import {
  EntityPickerButton,
  INPUT_FIELD_WIDTH,
  JobHandlerPicker,
  NewEntityButton,
  TReference,
  UIPluginSelector,
  EJobStatus,
  TJob,
} from '@dmt/common'
import * as React from 'react'
import { useState } from 'react'
import { Button, Input, Label, Typography } from '@equinor/eds-core-react'
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

export const JobEditAdvanced = (props: {
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
              </Column>
              <EntityPickerButton
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
              <UIPluginSelector
                type={formData.applicationInput.type}
                absoluteDottedId={`${dataSourceId}/${formData.applicationInput._id}`}
                categories={['container']}
              />
            </div>
          </GroupWrapper>
        </HeaderWrapper>

        <HeaderWrapper>
          <Typography variant="h3">Job runner</Typography>
          <GroupWrapper>
            <Column>
              <Label label={'Blueprint'} />
              <JobHandlerPicker
                onChange={(selectedBlueprint: string) =>
                  setFormData({
                    ...formData,
                    runner: { ...formData?.runner, type: selectedBlueprint },
                  })
                }
                formData={formData?.runner?.type || ''}
              />
              <div
                style={{
                  margin: '10px 20px',
                  borderLeft: '2px solid grey',
                  paddingLeft: '10px',
                }}
              >
                <UIPluginSelector
                  absoluteDottedId={`${dataSourceId}/${documentId}.runner`}
                  type={
                    (Object.keys(formData?.runner).length &&
                      formData.runner.type) ||
                    ''
                  }
                  breadcrumb={false}
                  categories={['edit']}
                />
              </div>
            </Column>
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
