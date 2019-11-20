import {
  AttributeOnChange,
  AttributeWrapper,
  DataType,
  TypeWidgetOld,
} from './DmtTypeWidget'
import React, { useState } from 'react'
import styled from 'styled-components'
import { BlueprintAttribute } from '../types'
import { DimensionWidget } from './DimensionWidget'
import { FieldProps, IdSchema } from 'react-jsonschema-form'
import { CommonWidgetProps, CreateTextWidget } from './WidgetWrappers'
import {RequiredAttributesGroup} from "../form_rjsf_edit/RequiredAttributes";

const AttributeGroup = styled.div`
  border: 1px solid;
  margin: 2px;
  padding: 5px;
  border-radius: 5px;
`

const REQUIRED_ATTRIBUTES = ['name', 'description', 'type']


export const AttributeWidget = (props: FieldProps) => {
  let { attributes, uiAttributes } = props.uiSchema

  const initialState = { type: DataType.STRING, ...props.formData }
  const [formData, setFormData] = useState<BlueprintAttribute>(initialState)

  if (!attributes) {
    return <div></div>
  }
  //@todo add order in uiRecipe to change order of elements in the widget.

  const attributeOnChange: AttributeOnChange = (
    name: string,
    value: string | boolean | number
  ): void => {
    let newFormData = { ...formData, [name]: value }
    setFormData(newFormData)
    props.onChange(newFormData)
  }

  const registry: FieldProps['Registry'] = props.registry

  const selectedType = formData['type']
  if (REQUIRED_ATTRIBUTES.includes(formData.name)) {
    return <RequiredAttributesGroup name={formData.name} type={formData.type} />
  }
  return (
    <AttributeGroup>
      {attributes.map((blueprintAttribute: BlueprintAttribute) => {
        const { name } = blueprintAttribute
        const value = (formData as any)[name]
        const uiAttribute =
          uiAttributes &&
          uiAttributes.find(
            (attr: any) => attr.name === blueprintAttribute.name
          )
        let widget = null
        if (uiAttribute) {
          widget = getUiWidget({
            registry,
            attribute: blueprintAttribute,
            uiAttribute,
            attributeOnChange,
            value,
            label: blueprintAttribute.name,
            selectedType,
            idSchema: props.idSchema,
          })
        }
        if (!widget) {
          widget = getDefaultWidget({
            registry,
            attribute: blueprintAttribute,
            onChange: (value: any) => {
              attributeOnChange(blueprintAttribute.name, value)
            },
            value,
            type: blueprintAttribute.type,
            label: blueprintAttribute.name,
            idSchema: props.idSchema,
          })
        }

        if (widget) {
          return (
            <AttributeWrapper key={name}>
              <label style={{ verticalAlign: 'top', marginRight: 10 }}>
                {name}:{' '}
              </label>
              {widget}
            </AttributeWrapper>
          )
        }
        return <div key={name} />
      })}
    </AttributeGroup>
  )
}

type UiAttribute = {
  field: string
  widget: string
}

interface UiWidgetProps extends CommonWidgetProps {
  uiAttribute: UiAttribute
  selectedType: string
  attributeOnChange: AttributeOnChange
  attribute: BlueprintAttribute
  idSchema: IdSchema
}

function getUiWidget(props: UiWidgetProps): any {
  const {
    uiAttribute,
    idSchema,
    registry,
    value,
    attribute,
    attributeOnChange,
    selectedType,
  } = props

  switch (uiAttribute.widget) {
    case 'dimensionsWidget':
      return (
        <DimensionWidget
          onChange={(value: string) => attributeOnChange(attribute.name, value)}
          value={value}
          attribute={attribute}
        />
      )
    case 'typeWidget':
      return (
        <TypeWidgetOld
          onChange={(value: string) => attributeOnChange(attribute.name, value)}
          attribute={attribute}
          value={value}
        />
      )
    case 'defaultWidget':
      const defaultAttribute = { ...attribute, type: selectedType }
      return getDefaultWidget({
        label: attribute.name,
        registry,
        value,
        idSchema,
        attribute: defaultAttribute,
        type: selectedType,
        onChange: (value: any) => attributeOnChange(attribute.name, value + ''),
      })
    case 'enumWidget':
      //@todo implement.
      if (attribute.enumType) {
        return <div>Enum</div>
      }
  }
  return null
}

interface DefaultWidgetProps extends CommonWidgetProps {
  attribute: BlueprintAttribute
  onChange: (value: any) => void
  type: string
  idSchema: any
}

function getDefaultWidget(props: DefaultWidgetProps): any {
  const { registry, attribute, onChange, value, idSchema, type } = props
  // defaults
  const id = idSchema.$id

  switch (attribute.name) {
    case 'description':
      return (
        <registry.widgets.TextareaWidget
          onChange={onChange}
          value={value}
          readonly={false}
          required={false}
          disabled={false}
          label={attribute.name}
          id={id}
          schema={{ type: 'string' }}
        />
      )
    case 'enumType':
      return null
  }

  switch (type) {
  }
  switch (attribute.type) {
    case 'boolean':
      let checked = false
      if (value !== undefined) {
        checked = Boolean(value)
      } else {
        if (attribute.default !== undefined) {
          checked = Boolean(attribute.default)
        }
      }
      return (
        <registry.widgets.CheckboxWidget
          onChange={onChange}
          id={id}
          value={checked}
          readonly={false}
          required={false}
          disabled={false}
          schema={{ type: 'boolean' }}
          label={attribute.name}
        />
      )
    case 'integer':
    case 'number':
      return (
        <registry.fields.NumberField
          registry={registry}
          id={id}
          onChange={onChange}
          value={Number(value) || Number(attribute.default)}
          readonly={false}
          required={false}
          disabled={false}
          idSchema={idSchema}
          schema={{ type: 'number' }}
          label={attribute.name}
        />
      )
      return registry.fields.NumberField

    case 'string':
      return (
        <CreateTextWidget
          onChange={onChange}
          registry={registry}
          idSchema={idSchema}
          value={value}
          label={attribute.name}
        />
      )
      break
    default:
      return <div></div>
  }
}
