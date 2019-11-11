import React, { useState } from 'react'
import { BlueprintAttribute } from '../types'
import { AttributeOnChange } from './DmtTypeWidget'

export enum ArrayType {
  SIMPLE = 'Simple',
  ARRAY = 'Array',
  MATRIX = 'Matrix',
}

function getArrayType(dimensions: string | undefined) {
  if (dimensions === '*') {
    return ArrayType.ARRAY
  }
  return ArrayType.SIMPLE
}

interface InputProps {
  attribute: BlueprintAttribute
  onChange: AttributeOnChange
}

type Props = {
  onChange: (value: any) => void
  value: string
  attribute: BlueprintAttribute
}

export const DimensionWidget = (props: Props) => {
  const { onChange, value, attribute } = props
  const [array, setArray] = useState<ArrayType>(getArrayType(value))
  const onChangeArray = (event: any) => {
    const arrayType = event.target.value

    let newValue = ''
    if (arrayType === ArrayType.ARRAY) {
      newValue = '*'
    }
    setArray(arrayType)
    onChange(newValue)
  }
  return (
    <>
      <ArrayRadioGroup onChange={onChangeArray} array={array} />
      {array === ArrayType.ARRAY && (
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <TextInput attribute={attribute} value={value} onChange={onChange} />{' '}
          <span>Format: [size,size] Example: "[*,10,2000]"</span>
        </div>
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
