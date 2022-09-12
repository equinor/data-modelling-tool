import React from 'react'

import ArrayField from './ArrayField'
import { ObjectField } from './ObjectField'
import { StringField } from './StringField'
import { isArray, isPrimitive } from '../utils'
import { BooleanField } from './BooleanField'
import { TAttributeFieldProps } from '../types'
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

export const AttributeField = (props: TAttributeFieldProps) => {
  const { namePath, attribute, uiAttribute } = props

  const fieldType = getFieldType(attribute)

  const displayLabel = getDisplayLabel(attribute)

  switch (fieldType) {
    case 'object':
      // Get the ui recipe name that should be used for nested
      return (
        <ObjectField
          namePath={namePath}
          displayLabel={displayLabel}
          contained={attribute.contained}
          type={attribute.attributeType}
          optional={attribute.optional}
          uiRecipeName={uiAttribute && uiAttribute.uiRecipe}
          uiAttribute={uiAttribute}
        />
      )

    case 'array':
      return (
        <ArrayField
          namePath={namePath}
          displayLabel={displayLabel}
          type={attribute.attributeType}
          uiAttribute={uiAttribute}
        />
      )
    case 'string':
      return (
        <StringField
          namePath={namePath}
          displayLabel={displayLabel}
          defaultValue={attribute.default}
          optional={attribute.optional}
          uiAttribute={uiAttribute}
        />
      )
    case 'boolean':
      return (
        <BooleanField
          namePath={namePath}
          displayLabel={displayLabel}
          defaultValue={attribute.default}
          uiAttribute={uiAttribute}
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
          uiAttribute={uiAttribute}
        />
      )
    default:
      return <>UnknownField</>
  }
}
