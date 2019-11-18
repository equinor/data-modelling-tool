//fallback when blueprint and blueprints cant be used.
import Switch from 'react-switch'
import React from 'react'
import { BlueprintAttribute } from '../types'
import { AttributeOnChange } from './AttributeInputs'

export function getBooleanValue(
  value: string | boolean | undefined,
  blueprintAttribute: BlueprintAttribute
): boolean {
  const defaultValue = blueprintAttribute.default
  if (value === undefined) {
    //use default value
    if (typeof defaultValue === 'string' && defaultValue) {
      return defaultValue === 'false' ? false : true
    }
    if (typeof defaultValue === 'boolean') {
      return defaultValue
    }
  }

  if (typeof value === 'boolean') {
    return value
  }

  if (typeof value === 'string' && value.length > 0) {
    if (value.length > 0) {
      if (value === 'true') {
        return true
      }
    }
  }

  return false
}

interface BoolDefaultInput {
  value: boolean | string
  attribute: BlueprintAttribute
  onChange: AttributeOnChange
}

export const BooleanWidget = (props: BoolDefaultInput) => {
  const { onChange, attribute, value } = props
  const onChangeBool = (inputValue: boolean) => {
    let newValue: string | boolean = inputValue
    if (attribute.type === 'string') {
      newValue = inputValue + '' //cast to string
    }
    onChange(attribute, newValue)
  }

  const booleanValue = getBooleanValue(value, attribute)
  return (
    <Switch
      onChange={onChangeBool}
      checked={booleanValue}
      height={20}
      width={50}
    />
  )
}
