import React, { useState } from 'react'
import {
  ArrayRadioGroup,
  ArrayType,
  AttributeOnChange,
  TextInput,
} from './AttributeInputs'
import { BlueprintAttributeType } from '../../domain/types'
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
  attributeType: BlueprintAttributeType
}

export const DimensionWidget = (props: Props) => {
  const { onChange, value, attributeType } = props
  const [array, setArray] = useState<ArrayType>(getArrayType(value))
  const attributeName = attributeType.name
  const onChangeArray = (event: any) => {
    const arrayType = event.target.value

    let newValue = ''
    if (arrayType === ArrayType.ARRAY) {
      newValue = '*'
    }
    setArray(arrayType)
    onChange(attributeType, newValue)
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
          <TextInput
            attributeType={attributeType}
            value={value}
            onChange={onChange}
          />{' '}
          <span>Format: [size,size] Example: "[*,10,2000]"</span>
        </div>
      )}
    </>
  )
}
