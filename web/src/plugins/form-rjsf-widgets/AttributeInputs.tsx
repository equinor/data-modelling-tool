import React from 'react'
import styled from 'styled-components'
import { ArrayType, DataType } from './Attribute'
import Switch from 'react-switch'
import DocumentFinderWidget from './DocumentFinderWidget'

const AttributeWrapper = styled.div`
  margin: 2px 2px;
  padding: 5px;
  border-radius: 5px;
`

export const TextInput = (props: any) => {
  const { onChange, value, label, name } = props
  return (
    <AttributeWrapper>
      {label}:{' '}
      <input type="text" name={name} value={value || ''} onChange={onChange} />
    </AttributeWrapper>
  )
}
export const BoolDefaultInput = (props: any) => {
  const { onChange, value, label } = props
  return (
    <AttributeWrapper>
      {label}:{' '}
      <Switch onChange={onChange} checked={value} height={20} width={40} />
    </AttributeWrapper>
  )
}

export const TypeInput = (props: any) => {
  const { onChange, value } = props
  return (
    <AttributeWrapper>
      <select value={value} onChange={onChange}>
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

export const DimensionWrapper = (props: any) => {
  const { onChange, array, value, attributeName } = props
  return (
    <>
      <ArrayRadioGroup
        onChange={onChange}
        attributeName={attributeName}
        array={array}
      />
      {array === ArrayType.ARRAY && (
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <TextInput value={value} onChange={onChange} />{' '}
          <span>Format: [size,size] Example: "[*,10,2000]"</span>
        </div>
      )}
    </>
  )
}
