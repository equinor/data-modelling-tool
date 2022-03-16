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

export const AttributeField = (props: AttributeFieldProps) => {
  const { namePath, attribute, formData } = props

  const fieldType = getFieldType(attribute)

  switch (fieldType) {
    case 'object':
      return (
        <ObjectField
          namePath={namePath}
          formData={formData}
          type={attribute.attributeType}
        />
      )

    case 'array':
      return (
        <ArrayField
          namePath={namePath}
          formData={formData}
          name={attribute.name}
          type={attribute.attributeType}
          label={attribute.label}
        />
      )
    case 'string':
      return (
        <StringField
          namePath={namePath}
          label={attribute.label}
          name={attribute.name}
          defaultValue={attribute.default}
        />
      )
    case 'boolean':
      return (
        <BooleanField
          namePath={namePath}
          label={attribute.label}
          name={attribute.name}
          defaultValue={attribute.default}
        />
      )
    case 'integer':
    case 'number':
      return (
        <NumberField
          namePath={namePath}
          label={attribute.label}
          name={attribute.name}
          defaultValue={attribute.default}
        />
      )
    default:
      return <>UnknownField</>
  }
}
