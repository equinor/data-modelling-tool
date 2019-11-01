import {
  TextInput,
  OnChange,
  BoolDefaultInput,
  TypeInput,
  BlueprintInput,
  DimensionWrapper,
} from './AttributeInputs'
import React, { useState } from 'react'
import styled from 'styled-components'
import { BlueprintAttribute } from '../types'
import { isPrimitive } from '../pluginUtils'

const AttributeGroup = styled.div`
  border: 1px solid;
  margin: 2px;
  padding: 5px;
  border-radius: 5px;
`
export enum ArrayType {
  SIMPLE = 'Simple',
  ARRAY = 'Array',
  MATRIX = 'Matrix',
}

export enum DataType {
  STRING = 'string',
  INTEGER = 'integer',
  BLUEPRINT = 'blueprint',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
}

function getArrayType(dimensions: string | undefined) {
  if (dimensions === '*') {
    return ArrayType.ARRAY
  }
  return ArrayType.SIMPLE
}

type Props = {
  formData: any
  onChange: OnChange
  attributes?: any[]
  uiSchema: any
}

export const AttributeWidget = (props: Props) => {
  let attributes = props.uiSchema.attributes
  if (!attributes) {
    //components/Form.tsx may use attribute.
    attributes = blueprintAttributes
  }

  const [formData, setFormData] = useState<BlueprintAttribute>(props.formData)
  const [array, setArray] = useState<ArrayType>(
    getArrayType(props.formData.dimensions)
  )

  const onChange = (name: string) => {
    return (event: any) => {
      let newFormData = { ...formData, [name]: event.target.value }
      setFormData(newFormData)
      props.onChange(newFormData)
    }
  }

  const onChangeBool = (name: string) => {
    return (value: boolean) => {
      let newFormData = { ...formData, [name]: value }
      setFormData(newFormData)
      props.onChange(newFormData)
    }
  }

  const onChangeArray = (event: any) => {
    const {
      target: { value },
    } = event
    let newFormData = { ...formData }

    if (value === ArrayType.SIMPLE) {
      newFormData.dimensions = ''
    }

    if (value === ArrayType.ARRAY) {
      newFormData.dimensions = '*'
    }
    setFormData(newFormData)
    setArray(value)
  }

  const { type } = formData
  const primitives = [
    DataType.STRING.toString(),
    DataType.NUMBER.toString(),
    DataType.BOOLEAN.toString(),
    DataType.INTEGER.toString(),
  ]

  //@todo add order in uiRecipe to change order of elements in the widget.

  const TypeWrapper = (props: any) => {
    const type: string = formData.type
    const isPrimitive = primitives.includes(type)
    const selectedType = isPrimitive ? type : DataType.BLUEPRINT
    const { onChange, attribute } = props
    const value = type === DataType.BLUEPRINT ? '' : type
    return (
      <>
        <TypeInput value={selectedType} onChange={onChange(attribute.name)} />
        {!isPrimitive && <BlueprintInput value={value} onChange={onChange} />}
      </>
    )
  }

  return (
    <AttributeGroup>
      {attributes.map((blueprintAttribute: BlueprintAttribute) => {
        const { name } = blueprintAttribute
        const attributeType = blueprintAttribute.type

        const value = (formData as any)[name] || blueprintAttribute.default
        switch (attributeType) {
          case 'string':
            if (name === 'type') {
              return (
                <span key={name}>
                  <TypeWrapper
                    onChange={onChange}
                    attribute={blueprintAttribute}
                  />
                </span>
              )
            } else if (name === 'dimensions') {
              return (
                <span key={name}>
                  <DimensionWrapper
                    array={array}
                    attributeName={name}
                    value={value}
                    onChange={onChangeArray}
                  />
                </span>
              )
            } else {
              return (
                <span key={name}>
                  <TextInput
                    label={name}
                    value={value}
                    onChange={onChange(name)}
                  />
                </span>
              )
            }
          case 'boolean':
            let booleanValue = (formData as any)[name]
            if (booleanValue === undefined) {
              booleanValue =
                blueprintAttribute.default === 'false' ? false : true
            }
            return (
              <span key={name}>
                <BoolDefaultInput
                  label={name}
                  value={booleanValue}
                  onChange={onChangeBool(name)}
                />
              </span>
            )
          default:
            if (isPrimitive(attributeType)) {
              console.warn(
                `Type is not supported in form widget: ${name} ${type}`
              )
            }
            return <div key={JSON.stringify(blueprintAttribute)} />
        }
      })}
    </AttributeGroup>
  )
}

//fallback when parent and children cant be used.
// works only for properties of blueprintAttribue.
//@todo pass parent and children from client code. Otherwise, remember to update this list whenever the BlueprintAttribute.json changes.
export const blueprintAttributes: BlueprintAttribute[] = [
  {
    type: 'string',
    name: 'name',
    optional: false,
  },
  {
    type: 'string',
    name: 'description',
    optional: false,
  },
  {
    name: 'default',
    type: 'string',
    optional: false,
    default: '',
    contained: true,
  },
  {
    type: 'string',
    name: 'type',
    enumType: 'system/SIMOS/attribute_types',
    optional: false,
  },
  {
    type: 'string',
    name: 'dimensions',
    optional: true,
    default: '',
  },
  {
    name: 'contained',
    type: 'boolean',
    default: true,
    contained: true,
    optional: true,
  },
  {
    name: 'optional',
    type: 'boolean',
    default: false,
    contained: true,
    optional: true,
  },
  {
    name: 'enumType',
    type: 'system/SIMOS/Enum',
    optional: true,
    default: '',
    contained: true,
  },
]
