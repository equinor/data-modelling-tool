import React from 'react'
import Form from 'react-jsonschema-form'
import { PluginProps } from '../types'
import { createFormConfigs, FormConfig } from './CreateConfig'
import { AttributeWidget } from '../form-rjsf-widgets/Attribute'

interface Props extends PluginProps {
  onSubmit: (data: any) => void
}

export const EditPlugin = (props: Props) => {
  const config: FormConfig = createFormConfigs(props)
  const formData = config.data
  return (
    <div style={{ marginBottom: 20 }}>
      <Form
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
        onChange={formData => {
          //console.log(formData)
        }}
        onSubmit={props.onSubmit}
      />
    </div>
  )
}
