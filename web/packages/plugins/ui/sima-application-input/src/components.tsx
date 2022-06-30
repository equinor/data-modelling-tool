import { Input, Label } from '@equinor/eds-core-react'
import {
  EntityPickerButton,
  INPUT_FIELD_WIDTH,
  NewEntityButton,
  TReference,
  UIPluginSelector,
} from '@dmt/common'
import * as React from 'react'
import styled from 'styled-components'

export const HeaderWrapper = styled.div`
  margin: 8px 0;
`
export const Column = styled.div``

export const Row = styled.div`
  display: flex;
`
export const GroupWrapper = styled.div`
  & > * {
    padding-top: 8px;
  }
`

export function EditInputEntity(props: {
  formData: any
  setFormData: Function
  dataSourceId: string
  onOpen?: Function
}) {
  const { formData, setFormData, dataSourceId, onOpen } = props

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end' }}>
        <Column>
          <Label label={'Input entity'} />
          <Input
            style={{ cursor: 'pointer', width: INPUT_FIELD_WIDTH }}
            type="string"
            value={formData?.input?.name || formData?.input?._id || ''}
            placeholder={formData?.input?.name || 'Select or create'}
            onChange={() => {}}
            onClick={() => {
              if (formData?.input?.type) {
                if (onOpen) {
                  onOpen({
                    attribute: 'input',
                    entity: formData.input,
                    absoluteDottedId: `${dataSourceId}/${formData?.input?._id}`,
                    categories: ['edit'],
                  })
                }
              }
            }}
          />
        </Column>
        <EntityPickerButton
          typeFilter={formData?.inputType || ''}
          onChange={(selectedEntity: TReference) =>
            setFormData({
              ...formData,
              input: selectedEntity,
            })
          }
          scope={formData?.inputPresetFolder}
        />
        <NewEntityButton
          type={formData?.inputType || ''}
          setReference={(createdEntity: TReference) =>
            setFormData({
              ...formData,
              input: createdEntity,
            })
          }
        />
      </div>
      {!onOpen && (
        <div
          style={{
            margin: '20px',
            borderLeft: '2px black solid',
            paddingLeft: '20px',
          }}
        >
          {formData?.input?.type && (
            <UIPluginSelector
              type={formData.input.type}
              categories={['edit']}
              absoluteDottedId={`${dataSourceId}/${formData?.input?._id}`}
            />
          )}
        </div>
      )}
    </div>
  )
}
