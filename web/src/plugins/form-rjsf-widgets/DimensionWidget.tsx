import React, { useState } from 'react'
import {
  ArrayRadioGroup,
  ArrayType,
  AttributeOnChange,
  TextInput,
} from './AttributeInputs'
import { BlueprintAttributeType } from '../types'
import { BlueprintAttribute } from '../../domain/BlueprintAttribute'

function getArrayType(dimensions: string | undefined) {
  if (dimensions && BlueprintAttribute.isArray(dimensions)) {
    return ArrayType.ARRAY
  }
  return ArrayType.SIMPLE
}

type Props = {
  onChange: AttributeOnChange
  value: string
  attribute: BlueprintAttributeType
}

export const DimensionWidget = (props: Props) => {
  const { onChange, value, attribute } = props
  const [array, setArray] = useState<ArrayType>(getArrayType(value))
  const attributeName = attribute.name
  const onChangeArray = (event: any) => {
    const arrayType = event.target.value

    let newValue = ''
    if (arrayType === ArrayType.ARRAY) {
      newValue = '*'
    }
    setArray(arrayType)
    onChange(attribute, newValue)
  }
  return (
    <>
      <ArrayRadioGroup
        onChange={onChangeArray}
        attributeName={attributeName}
        array={array}
      />
      {array === ArrayType.ARRAY && (
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <TextInput attribute={attribute} value={value} onChange={onChange} />{' '}
          <span>Format: [size,size] Example: "[*,10,2000]"</span>
        </div>
      )}
    </>
  )
}
