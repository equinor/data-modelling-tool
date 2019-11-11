import React, { useState } from 'react'
import styled from 'styled-components'
import DocumentFinderWidget from './DocumentFinderWidget'
import { BlueprintAttribute } from '../types'
import { isPrimitive } from '../pluginUtils'

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

export type AttributeOnChange = (
  name: any,
  value: string | boolean | number
) => void

export const TypeInput = (props: any) => {
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
  onChange: (value: any) => void
  attribute: BlueprintAttribute
  value: string
}

export const TypeWidgetOld = (props: TypeProps) => {
  const { onChange, attribute, value } = props
  const typeValue = isPrimitive(value) ? value : DataType.BLUEPRINT
  const [selectedType, setSelectedType] = useState(
    typeValue || attribute.default
  )
  const blueprintValue = isPrimitive(value) ? '' : value
  return (
    <>
      <TypeInput
        value={selectedType}
        attribute={attribute}
        onChange={(event: any) => {
          setSelectedType(event.target.value)
          console.log(event.target.value)
          onChange(event.target.value)
        }}
      />
      {selectedType === DataType.BLUEPRINT && (
        <BlueprintInput {...props} value={blueprintValue} />
      )}
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
    <DocumentFinderWidget
      value={displayValue}
      onChange={(event: any) => onChange(attribute, event.target.value)}
      attributeInput={true}
    />
  )
}
