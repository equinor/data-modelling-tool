import {
  BlueprintPicker,
  IDmtUIPlugin,
  INPUT_FIELD_WIDTH,
  Loading,
  Select,
  truncatePathString,
  useDocument,
} from '@development-framework/dm-core'
import * as React from 'react'
import { ChangeEvent, useEffect, useState } from 'react'
import {
  Accordion,
  Button,
  Icon,
  Label,
  Switch,
  TextField,
} from '@equinor/eds-core-react'
import styled from 'styled-components'

const Spacer = styled.div`
  margin-top: 15px;
`

type TAttribute = {
  type: string
  name: string
  attributeType: EAttributeTypes | string
  dimensions: string
  label: string
  default?: string
  optional: boolean
  contained: boolean
}

enum EAttributeTypes {
  string = 'string',
  number = 'number',
  boolean = 'boolean',
  object = 'object',
}

const Extends = (props: {
  formData: string[]
  setExtends: (data: any) => void
}) => {
  const { formData, setExtends } = props
  const [newBlueprint, setNewBlueprint] = useState<string>('')

  return (
    <>
      <Label label="Extends" />
      <ul>
        {formData.map((typeRef: string, index: number) => (
          <li key={index}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {typeRef}
              <Button
                variant="ghost_icon"
                color="danger"
                style={{ width: '24px', height: '24px' }}
                onClick={() =>
                  setExtends(
                    formData.filter(
                      (typeToRemove: string) => typeToRemove !== typeRef
                    )
                  )
                }
              >
                <Icon
                  name="close_circle_outlined"
                  title="save action"
                  size={18}
                />
              </Button>
            </div>
          </li>
        ))}
      </ul>
      <div style={{ display: 'flex' }}>
        <BlueprintPicker
          onChange={(selectedBlueprint: string) =>
            setNewBlueprint(selectedBlueprint)
          }
          formData={newBlueprint}
        />
        <Button
          disabled={!newBlueprint || formData.includes(newBlueprint)}
          style={{ marginLeft: '10px' }}
          onClick={() => {
            setExtends([...formData, newBlueprint])
            setNewBlueprint('')
          }}
        >
          Add
        </Button>
      </div>
    </>
  )
}

const BlueprintAttribute = (props: {
  attribute: TAttribute
  setAttribute: (attr: TAttribute) => void
}) => {
  const { attribute, setAttribute } = props

  return (
    <div>
      <TextField
        id="name"
        label={'Name'}
        value={attribute?.name || ''}
        placeholder="Name of the attribute"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setAttribute({ ...attribute, name: event.target.value })
        }
        style={{ width: INPUT_FIELD_WIDTH }}
      />
      <Spacer />
      <TextField
        id="label"
        label={'Label'}
        value={attribute?.label || ''}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setAttribute({ ...attribute, label: event.target.value })
        }
        style={{ width: INPUT_FIELD_WIDTH }}
      />
      <Spacer />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'block' }}>
          <Label label={'Type'} />
          <Select
            value={truncatePathString(attribute.attributeType || '')}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setAttribute({
                ...attribute,
                attributeType: e.target.value,
              })
            }
          >
            {Object.keys(EAttributeTypes).map((key) => {
              // Avoid duplication, as we are explicitly adding the formData value as well
              if (key === attribute.attributeType) return null
              return <option key={key}>{key}</option>
            })}
            <option key={attribute.attributeType}>
              {attribute.attributeType}
            </option>
          </Select>
        </div>
        {!['string', 'number', 'boolean'].includes(attribute.attributeType) && (
          <div style={{ marginLeft: '10px' }}>
            <BlueprintPicker
              label={'Select blueprint'}
              onChange={(selectedBlueprint: string) =>
                setAttribute({
                  ...attribute,
                  attributeType: selectedBlueprint,
                })
              }
              formData={attribute.attributeType}
            />
          </div>
        )}
      </div>
      <Spacer />
      <TextField
        id="default"
        label={'Default value'}
        value={attribute?.default || ''}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setAttribute({ ...attribute, default: event.target.value })
        }
        style={{ width: INPUT_FIELD_WIDTH }}
      />
      <Spacer />
      <div style={{ display: 'flex', alignItems: 'flex-end' }}>
        <TextField
          id="dimensions"
          label={'Dimensions'}
          value={attribute?.dimensions || ''}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setAttribute({ ...attribute, dimensions: event.target.value })
          }
          style={{ width: '140px' }}
        />
        <Label label='Example: "*,2,99"' />
      </div>
      <Switch
        label="Contained"
        defaultChecked={attribute?.contained}
        onChange={(e: any) =>
          setAttribute({ ...attribute, contained: e.target.checked })
        }
      />
      <Switch
        label="Optional"
        defaultChecked={attribute?.optional}
        onChange={(e: any) =>
          setAttribute({ ...attribute, optional: e.target.checked })
        }
      />
    </div>
  )
}

export const EditBlueprint = (props: IDmtUIPlugin) => {
  const { documentId, dataSourceId } = props
  const [document, _loading, updateDocument] = useDocument<any>(
    dataSourceId,
    documentId
  )
  const [formData, setFormData] = useState<any>({ ...document })

  useEffect(() => {
    if (!document) return
    setFormData(document)
  }, [document])

  if (!document || _loading) return <Loading />

  return (
    <div style={{ margin: '10px' }}>
      <Spacer />
      <TextField
        id="name"
        label={'Name'}
        value={formData?.name || ''}
        placeholder="Name of the blueprint"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setFormData({ ...formData, name: event.target.value })
        }
        style={{ width: INPUT_FIELD_WIDTH }}
      />
      <Spacer />
      <Extends
        formData={formData?.extends || []}
        setExtends={(newExtends: string[]) =>
          setFormData({ ...formData, extends: newExtends })
        }
      />
      <Spacer />
      <TextField
        id="description"
        label={'Description'}
        value={formData?.description || ''}
        multiline
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setFormData({ ...formData, description: event.target.value })
        }
      />
      <Spacer />
      <Label label="Attributes" />
      <Accordion>
        {Array.isArray(formData?.attributes) &&
          formData.attributes.map((attribute: any, index: number) => (
            <Accordion.Item key={index}>
              <Accordion.Header>
                {attribute.name} {attribute.attributeType}{' '}
                {attribute?.dimensions || '-'}
                {attribute?.contained === undefined ||
                attribute?.contained === true
                  ? 'Contained'
                  : 'Uncontained'}
                <Button
                  variant="ghost_icon"
                  color="danger"
                  style={{ width: '24px', height: '24px' }}
                  onClick={() => {
                    formData.attributes.splice(index, 1)
                    setFormData({
                      ...formData,
                      attributes: [...formData.attributes],
                    })
                  }}
                >
                  <Icon
                    name="close_circle_outlined"
                    title="remove attribute"
                    size={24}
                  />
                </Button>
              </Accordion.Header>
              <Accordion.Panel>
                <BlueprintAttribute
                  attribute={attribute}
                  setAttribute={(changedAttribute: any) => {
                    const newAttributes = [...formData.attributes]
                    newAttributes[index] = changedAttribute
                    setFormData({ ...formData, attributes: newAttributes })
                  }}
                />
              </Accordion.Panel>
            </Accordion.Item>
          ))}
      </Accordion>
      <div style={{ display: 'flex', justifyContent: 'end', margin: '5px' }}>
        <Button
          as="button"
          variant="outlined"
          onClick={() =>
            setFormData({
              ...formData,
              attributes: [
                ...formData.attributes,
                {
                  name: 'new-attribute',
                  attributeType: 'string',
                  type: 'system/SIMOS/BlueprintAttribute',
                  contained: true,
                  optional: true,
                },
              ],
            })
          }
        >
          Add attribute
        </Button>
      </div>
      <div
        style={{
          justifyContent: 'space-around',
          display: 'flex',
          marginTop: '15px',
        }}
      >
        <Button
          as="button"
          variant="outlined"
          color="danger"
          onClick={() => setFormData({ ...document })}
        >
          Reset
        </Button>
        <Button as="button" onClick={() => updateDocument(formData, true)}>
          Update
        </Button>
      </div>
    </div>
  )
}
