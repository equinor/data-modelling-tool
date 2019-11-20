import React from 'react'
import { BlueprintAttribute } from '../types'
import { DmtWidgetProps } from './types'
import { TypeWidgetOld } from '../form-rjsf-fields/DmtTypeWidget'

export const TypeWidget = (props: DmtWidgetProps) => {
  const { value, onChange, dtos, blueprint, label } = props
  console.log(props)
  const attribute: BlueprintAttribute | undefined = blueprint.attributes.find(
    (attr: BlueprintAttribute) => attr.name === label
  )

  if (attribute) {
    return (
      <div>
        <TypeWidgetOld
          value={value}
          onChange={onChange}
          attribute={attribute}
        />
        {props.registry.widgets.TextField}
      </div>
    )
  }
  return null
}
