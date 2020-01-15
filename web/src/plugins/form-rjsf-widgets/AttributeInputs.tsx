import React, { useState } from 'react'
import styled from 'styled-components'
import { BlueprintAttributeType } from '../../domain/types'
import BlueprintSelectorWidget from './BlueprintSelectorWidget'
import { BlueprintAttribute } from '../../domain/BlueprintAttribute'

export const AttributeWrapper = styled.div`
  margin: 2px 2px;
  padding: 5px;
  border-radius: 5px;
`

export enum DataType {
  STRING = 'string',
  INTEGER = 'integer',
  BLUEPRINT = 'blueprint',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
}

interface InputProps {
  attributeType: BlueprintAttributeType
  onChange: AttributeOnChange
}

export enum ArrayType {
  SIMPLE = 'Simple',
  ARRAY = 'Array',
  MATRIX = 'Matrix',
}

export type AttributeOnChange = (
  name: any,
  value: string | boolean | number
) => void

interface TextInputProps extends InputProps {
  value: string
}

export const TextInput = (props: TextInputProps) => {
  const { onChange, attributeType } = props
  let { value } = props

  const name = attributeType.name
  if (value === undefined && attributeType.default !== undefined) {
    value = String(attributeType.default)
  }
  return (
    <input
      type="text"
      name={name}
      value={value || attributeType.default || ''}
      onChange={event => onChange(attributeType, event.target.value)}
    />
  )
}

export const TextAreaWidget = (props: TextInputProps) => {
  const { onChange, attributeType } = props
  let { value } = props

  if (value === undefined && attributeType.default !== undefined) {
    value = String(attributeType.default)
  }
  return (
    <textarea
      style={{ width: 200, height: 40 }}
      value={value || attributeType.default || ''}
      onChange={event => onChange(attributeType, event.target.value)}
    />
  )
}

interface NumberInputProps extends InputProps {
  value: number
}

export const NumberInput = (props: NumberInputProps) => {
  const { onChange, attributeType } = props
  let { value } = props
  const name = attributeType.name
  if (!value && attributeType.default !== undefined) {
    value = Number(attributeType.default)
  }
  return (
    <input
      type="number"
      name={name}
      value={value}
      onChange={event => onChange(attributeType, event.target.value)}
    />
  )
}

export const TypeDropdown = (props: any) => {
  const { onChange, value } = props
  return (
    <select value={value} onChange={onChange}>
      <option value={DataType.STRING}>String</option>
      <option value={DataType.INTEGER}>Integer</option>
      <option value={DataType.NUMBER}>Number</option>
      <option value={DataType.BOOLEAN}>Boolean</option>
      <option value={DataType.BLUEPRINT}>Blueprint</option>
    </select>
  )
}

type TypeProps = {
  onChange: AttributeOnChange
  attributeType: BlueprintAttributeType
  value: string
  uiSchema: any
}

export const TypeWidget = (props: TypeProps) => {
  const { onChange, attributeType, value } = props
  const attr = new BlueprintAttribute(attributeType)
  const typeValue = attr.isPrimitiveType(value) ? value : DataType.BLUEPRINT
  const [selectedType, setSelectedType] = useState(
    typeValue || attributeType.default
  )
  let blueprintValue
  if (typeValue === DataType.BLUEPRINT && value !== DataType.BLUEPRINT) {
    blueprintValue = value
  } else {
    blueprintValue = ''
  }
  return (
    <>
      <TypeDropdown
        value={selectedType}
        onChange={(event: any) => {
          setSelectedType(event.target.value)
          onChange(attributeType, event.target.value)
        }}
      />
      {selectedType === DataType.BLUEPRINT && (
        <BlueprintSelectorWidget
          onChange={(value: any) => {
            onChange(attributeType, value)
          }}
          formData={blueprintValue}
          uiSchema={{}}
        />
      )}
    </>
  )
}

export const ArrayRadioGroup = (props: any) => {
  const { onChange, array } = props
  return (
    <>
      <label>
        <input
          onChange={onChange}
          style={{ marginLeft: '10px' }}
          type="radio"
          value={ArrayType.SIMPLE}
          checked={array === ArrayType.SIMPLE}
        />
        Simple
      </label>
      <label>
        <input
          onChange={onChange}
          style={{ marginLeft: '10px' }}
          type="radio"
          value={ArrayType.ARRAY}
          checked={array === ArrayType.ARRAY}
        />
        Array
      </label>
    </>
  )
}
