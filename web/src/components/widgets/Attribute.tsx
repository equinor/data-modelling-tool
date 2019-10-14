import {
  ArrayRadioGroup,
  BlueprintInput,
  DefaultValueInput,
  DimensionsInput,
  NameInput,
  OnChange,
  TypeInput,
} from './AttributeInputs'
import React, { useState } from 'react'
import styled from 'styled-components'

const AttributeGroup = styled.div`
  border: 1px solid;
  margin: 2px;
  padding: 5px;
  border-radius: 5px;
`
export enum ArrayType {
  SIMPLE = 'Simple',
  ARRAY = 'Array',
  COMPLEX = 'Complex',
}

export enum DataType {
  STRING = 'string',
  INTEGER = 'integer',
  BLUEPRINT = 'blueprint',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
}

function getArrayType(dimensions: string | undefined) {
  if (dimensions === undefined) {
    return ArrayType.SIMPLE
  }
  if (dimensions === '[*]') {
    return ArrayType.ARRAY
  } else {
    return ArrayType.COMPLEX
  }
}

type Props = {
  formData: any
  onChange: OnChange
}

export default (props: Props) => {
  const [formData, setFormData] = useState(props.formData)
  const [array, setArray] = useState(getArrayType(props.formData.dimensions))

  const onChange = (name: string) => {
    return (event: any) => {
      let newFormData = { ...formData }
      if (name === 'array') {
        const arrayType = event.target.value

        if (arrayType === ArrayType.SIMPLE) {
          newFormData.dimensions = undefined
        }
        if (arrayType === ArrayType.ARRAY) {
          newFormData.dimensions = '[*]'
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

  const { name, type, value, dimensions } = formData
  const primitives = [
    DataType.STRING,
    DataType.NUMBER,
    DataType.BOOLEAN,
    DataType.INTEGER,
  ]
  const isPrimitive = primitives.includes(type)
  const selectedType = isPrimitive ? type : DataType.BLUEPRINT
  return (
    <AttributeGroup>
      <NameInput value={name} onChange={onChange} />
      <TypeInput value={selectedType} onChange={onChange} />
      {!isPrimitive && <BlueprintInput value={type} onChange={onChange} />}
      <ArrayRadioGroup onChange={onChange} attributeName={name} array={array} />
      {array === ArrayType.COMPLEX && (
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <DimensionsInput value={dimensions} onChange={onChange} />{' '}
          <span>Format: [size,size] Example: "[*,10,2000]"</span>
        </div>
      )}
      {array === ArrayType.SIMPLE && type !== DataType.BLUEPRINT && (
        <DefaultValueInput value={value} onChange={onChange} />
      )}
    </AttributeGroup>
  )
}
