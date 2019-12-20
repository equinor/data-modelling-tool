import React, { useState } from 'react'
import styled from 'styled-components'
import { BlueprintAttributeType } from '../types'
import { isPrimitive } from '../pluginUtils'
import BlueprintSelectorWidget from './BlueprintSelectorWidget'

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
  attribute: BlueprintAttributeType
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
  const { onChange, attribute } = props
  let { value } = props

  const name = attribute.name
  if (value === undefined && attribute.default !== undefined) {
    value = String(attribute.default)
  }
  return (
    <input
      type="text"
      name={name}
      value={value || attribute.default || ''}
      onChange={event => onChange(attribute, event.target.value)}
    />
  )
}

export const TextAreaWidget = (props: TextInputProps) => {
  const { onChange, attribute } = props
  let { value } = props

  if (value === undefined && attribute.default !== undefined) {
    value = String(attribute.default)
  }
  return (
    <textarea
      style={{ width: 200, height: 40 }}
      value={value || attribute.default || ''}
      onChange={event => onChange(attribute, event.target.value)}
    />
  )
}

interface NumberInputProps extends InputProps {
  value: number
}

export const NumberInput = (props: NumberInputProps) => {
  const { onChange, attribute } = props
  let { value } = props
  const name = attribute.name
  if (!value && attribute.default !== undefined) {
    value = Number(attribute.default)
  }
  return (
    <input
      type="number"
      name={name}
      value={value}
      onChange={event => onChange(attribute, event.target.value)}
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
  attribute: BlueprintAttributeType
  value: string
  uiSchema: any
}

export const TypeWidget = (props: TypeProps) => {
  const { onChange, attribute, value } = props
  const typeValue = isPrimitive(value) ? value : DataType.BLUEPRINT
  const [selectedType, setSelectedType] = useState(
    typeValue || attribute.default
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
        attribute={attribute}
        onChange={(event: any) => {
          setSelectedType(event.target.value)
          onChange(attribute, event.target.value)
        }}
      />
      {selectedType === DataType.BLUEPRINT && (
        <BlueprintSelectorWidget
          onChange={(value: any) => {
            onChange(attribute, value)
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
