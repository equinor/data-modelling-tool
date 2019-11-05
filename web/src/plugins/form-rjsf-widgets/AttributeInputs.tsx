import React, { useState } from 'react'
import styled from 'styled-components'
import DocumentFinderWidget from './DocumentFinderWidget'
import { BlueprintAttribute } from '../types'

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
  attribute: BlueprintAttribute
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
  const { onChange, attribute, value } = props

  const name = attribute.name

  return (
    <>
      {name}:{' '}
      <input
        type="text"
        name={name}
        value={value || ''}
        onChange={event => onChange(attribute, event.target.value)}
      />
    </>
  )
}

interface NumberInputProps extends InputProps {
  value: number
}

export const NumberInput = (props: NumberInputProps) => {
  const { onChange, attribute, value } = props
  const name = attribute.name

  return (
    <>
      {name}:{' '}
      <input
        type="number"
        name={name}
        value={value || ''}
        onChange={event => onChange(attribute, event.target.value)}
      />
    </>
  )
}

export const TypeInput = (props: any) => {
  const { onChange, value } = props
  return (
    <>
      <select value={value} onChange={onChange}>
        <option value={DataType.STRING}>String</option>
        <option value={DataType.INTEGER}>Integer</option>
        <option value={DataType.NUMBER}>Number</option>
        <option value={DataType.BOOLEAN}>Boolean</option>
        <option value={DataType.BLUEPRINT}>Blueprint</option>
      </select>
    </>
  )
}

type BlueprintInputProps = {
  value: string
  onChange: AttributeOnChange
  attribute: BlueprintAttribute
}

export const BlueprintInput = (props: BlueprintInputProps) => {
  const { onChange, value, attribute } = props
  // Just so not to display "blueprint" as a "selected blueprint" when none is selected
  let displayValue = value
  if (value === DataType.BLUEPRINT) {
    displayValue = ''
  }
  return (
    <AttributeWrapper>
      Blueprint:{' '}
      <DocumentFinderWidget
        value={displayValue}
        onChange={(event: any) => onChange(attribute, event.target.value)}
        attributeInput={true}
      />
    </AttributeWrapper>
  )
}

type TypeProps = {
  onChange: AttributeOnChange
  attribute: BlueprintAttribute
}

export const TypeWrapper = (props: TypeProps) => {
  const { onChange, attribute } = props
  const [selectedType, setSelectedType] = useState(
    attribute.default || DataType.STRING
  )
  return (
    <>
      <TypeInput
        value={selectedType}
        onChange={(event: any) => {
          setSelectedType(event.target.value)
          onChange(attribute, event.target.value)
        }}
      />
      {selectedType === DataType.BLUEPRINT && (
        <BlueprintInput {...props} value={selectedType} />
      )}
    </>
  )
}

export const ArrayRadioGroup = (props: any) => {
  const { onChange, array } = props
  return (
    <AttributeWrapper>
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
    </AttributeWrapper>
  )
}
