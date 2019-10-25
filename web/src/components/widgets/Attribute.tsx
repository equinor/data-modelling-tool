import {
  ArrayRadioGroup,
  BlueprintInput,
  DefaultValueInput,
  DescriptionInput,
  DimensionsInput,
  NameInput,
  OnChange,
  TypeInput,
} from './AttributeInputs'
import React, { useState } from 'react'
import styled from 'styled-components'
import { Blueprint } from '../../plugins/types'

const AttributeGroup = styled.div`
  border: 1px solid;
  margin: 2px;
  padding: 5px;
  border-radius: 5px;
`
export enum ArrayType {
  SIMPLE = 'Simple',
  ARRAY = 'Array',
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
}

const AttributeWidgetEnhanced = (props: Props) => {
  const [formData, setFormData] = useState(props.formData)
  const [array, setArray] = useState(getArrayType(props.formData.dimensions))

  const onChange = (name: string) => {
    return (event: any) => {
      event.preventDefault()
      let newFormData = { ...formData }
      if (name === 'array') {
        const arrayType = event.target.value

        if (arrayType === ArrayType.SIMPLE) {
          newFormData.dimensions = ''
        }
        if (arrayType === ArrayType.ARRAY) {
          newFormData.dimensions = '*'
        }
        setFormData(newFormData)
        setArray(arrayType)
      } else {
        newFormData[name] = event.target.value
        setFormData(newFormData)
        props.onChange(newFormData)
      }
    }
  }

  const {
    name,
    description,
    type,
    default: defaultValue,
    dimensions,
  } = formData
  const primitives = [
    DataType.STRING,
    DataType.NUMBER,
    DataType.BOOLEAN,
    DataType.INTEGER,
  ]

  //defaults
  let isPrimitive = true
  let selectedType = 'string'
  if (type) {
    isPrimitive = primitives.includes(type)
    selectedType = isPrimitive ? type : DataType.BLUEPRINT
  }
  return (
    <AttributeGroup>
      <NameInput value={name || ''} onChange={onChange} />
      <DescriptionInput value={description} onChange={onChange} />
      <TypeInput value={selectedType} onChange={onChange} />
      {!isPrimitive && <BlueprintInput value={type} onChange={onChange} />}
      <ArrayRadioGroup onChange={onChange} attributeName={name} array={array} />
      {array === ArrayType.ARRAY && (
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <DimensionsInput value={dimensions} onChange={onChange} />{' '}
          <span>Format: [size,size] Example: "[*,10,2000]"</span>
        </div>
      )}
      {array === ArrayType.SIMPLE && type !== DataType.BLUEPRINT && (
        <DefaultValueInput value={defaultValue} onChange={onChange} />
      )}
    </AttributeGroup>
  )
}

/**
 * Parent is used to generate defaults, a description attributes has other defaults
 * than a type attribute or boolean attribute.
 *
 * @param parent Blueprint
 */
export const attributeWidget = (parent?: Blueprint) => {
  return (props: Props) => {
    const { formData, onChange } = props
    return <AttributeWidgetEnhanced formData={formData} onChange={onChange} />
  }
}
