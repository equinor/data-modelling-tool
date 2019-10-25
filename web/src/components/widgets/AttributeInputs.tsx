import DocumentFinderWidget from './DocumentFinderWidget'
import React from 'react'
import styled from 'styled-components'
import { ArrayType, DataType } from './Attribute'
import Switch from 'react-switch'

const AttributeWrapper = styled.div`
  margin: 2px 2px;
  padding: 5px;
  border-radius: 5px;
`

export const NameInput = (props: any) => {
  const { onChange, value } = props
  return (
    <AttributeWrapper>
      Name: <input type="string" value={value} onChange={onChange('name')} />
    </AttributeWrapper>
  )
}
export const BoolDefaultInput = (props: any) => {
  const { onChange, value } = props
  let checked = value === 'true'
  return (
    <AttributeWrapper>
      Default: <Switch onChange={onChange('default')} checked={checked} />
    </AttributeWrapper>
  )
}

export const DescriptionInput = (props: any) => {
  const { onChange, value } = props
  return (
    <AttributeWrapper>
      Description:{' '}
      <input type="string" value={value} onChange={onChange('description')} />
    </AttributeWrapper>
  )
}

export const TypeInput = (props: any) => {
  const { onChange, value } = props
  return (
    <AttributeWrapper>
      <select value={value} onChange={onChange('type')}>
        <option value={DataType.STRING}>String</option>
        <option value={DataType.INTEGER}>Integer</option>
        <option value={DataType.NUMBER}>Number</option>
        <option value={DataType.BOOLEAN}>Boolean</option>
        <option value={DataType.BLUEPRINT}>Blueprint</option>
      </select>
    </AttributeWrapper>
  )
}

export type OnChange = (event: any) => void
export type OnChangeClosure = (name: any) => OnChange

type WidgetInput = {
  value: string
  onChange: OnChangeClosure
}

export const BlueprintInput = (props: WidgetInput) => {
  const { onChange, value } = props
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
        onChange={onChange('type')}
        attributeInput={true}
      />
    </AttributeWrapper>
  )
}

export const DefaultValueInput = (props: any) => {
  const { onChange, value, type } = props
  return (
    <AttributeWrapper>
      Default value:{' '}
      <input type={type} value={value} onChange={onChange('default')} />
    </AttributeWrapper>
  )
}

export const ArrayRadioGroup = (props: any) => {
  const { onChange, attributeName, array } = props
  const valueName = 'array'
  return (
    <AttributeWrapper>
      <label>
        <input
          onChange={onChange(valueName)}
          style={{ marginLeft: '10px' }}
          type="radio"
          value={ArrayType.SIMPLE}
          name={`array-${attributeName}`}
          checked={array === ArrayType.SIMPLE}
        />
        Simple
      </label>
      <label>
        <input
          onChange={onChange(valueName)}
          style={{ marginLeft: '10px' }}
          type="radio"
          value={ArrayType.ARRAY}
          name={`array-${attributeName}`}
          checked={array === ArrayType.ARRAY}
        />
        Array
      </label>
    </AttributeWrapper>
  )
}

export const DimensionsInput = (props: any) => {
  const { onChange, value } = props
  return (
    <AttributeWrapper>
      Dimensions:
      <input type="string" value={value} onChange={onChange('dimensions')} />
    </AttributeWrapper>
  )
}
