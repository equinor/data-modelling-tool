import React from 'react'

import ArrayField from './ArrayField'
import { ObjectField } from './ObjectField'
import { StringField } from './StringField'
import { isArray, isPrimitive } from '../utils'
import { BooleanField } from './BooleanField'
import { AttributeFieldProps } from '../types'
import { NumberField } from './NumberField'

const getFieldType = (attribute: any) => {
  const { attributeType, dimensions } = attribute

  if (!isArray(dimensions) && isPrimitive(attributeType)) {
    return attributeType
  }

  if (isArray(dimensions)) {
    return 'array'
  } else {
    return 'object'
  }
}

const getDisplayLabel = (attribute: any): string => {
  const { name, label, optional } = attribute

  const displayLabel = label === undefined || label === '' ? name : label

  return optional ? `${displayLabel} (optional)` : displayLabel
}

export const AttributeField = (props: AttributeFieldProps) => {
  const { namePath, attribute } = props

  const fieldType = getFieldType(attribute)

  const displayLabel = getDisplayLabel(attribute)

  switch (fieldType) {
    case 'object':
      return (
        <ObjectField
          namePath={namePath}
          displayLabel={displayLabel}
          type={attribute.attributeType}
          optional={attribute.optional}
        />
      )

    case 'array':
      return (
        <ArrayField
          namePath={namePath}
          displayLabel={displayLabel}
          type={attribute.attributeType}
        />
      )
    case 'string':
      return (
        <StringField
          namePath={namePath}
          displayLabel={displayLabel}
          defaultValue={attribute.default}
          optional={attribute.optional}
        />
      )
    case 'boolean':
      return (
        <BooleanField
          namePath={namePath}
          displayLabel={displayLabel}
          defaultValue={attribute.default}
        />
      )
    case 'integer':
    case 'number':
      return (
        <NumberField
          namePath={namePath}
          displayLabel={displayLabel}
          defaultValue={attribute.default}
          optional={attribute.optional}
        />
      )
    default:
      return <>UnknownField</>
  }
}
