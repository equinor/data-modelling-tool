import React from 'react'
import Form from 'react-jsonschema-form'
import { PluginProps } from '../types'
import { createFormConfigs, FormConfig } from './CreateConfig'
import { AttributeWidget } from '../form-rjsf-widgets/Attribute'
import { Blueprint, KeyValue } from '../Blueprint'
import { Blueprint as BlueprintType } from '../types'

export interface EditPluginProps extends PluginProps {
  onSubmit: (data: any) => void
  rootDocument: BlueprintType | undefined
}

export const EditPlugin = (props: EditPluginProps) => {
  const blueprint = new Blueprint(props.blueprint)
  const config: FormConfig = createFormConfigs(props)
  const formData = config.data
  return (
    <div style={{ marginBottom: 20 }}>
      <Form
        validate={validate(blueprint)}
        schema={config.template}
        formData={formData || {}}
        uiSchema={config.uiSchema || {}}
        fields={{
          attribute: AttributeWidget,
          hidden: () => <div />,
        }}
        widgets={{
          enumWidget: () => <div>EnumType widget</div>,
        }}
        onSubmit={props.onSubmit}
      />
    </div>
  )
}

/**
 * Fundamental client side validation.
 * Ensure only valid entities are posted.
 *
 * @todo set defaults in formData passed to form.
 * @param blueprint
 */
function validate(blueprint: Blueprint) {
  return (formData: KeyValue, errors: any) => {
    Object.keys(formData).forEach((key: string) => {
      const attr = blueprint.getAttribute(key)
      if (attr) {
        if (blueprint.isArray(attr) && !blueprint.isPrimitive(attr.type)) {
          const arr: any[] = formData[key]
          arr.forEach((item: any, index: number) => {
            if (!item.name) {
              errors[key][index].addError('name must be set')
            }
            if (!item.type) {
              errors[key][index].addError('type must be set')
            }
          })
        }
      }
    })
    return errors
  }
}
