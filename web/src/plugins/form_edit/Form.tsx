import React from 'react'
import Form from 'react-jsonschema-form'
import AttributeWidget from '../../components/widgets/Attribute'
import { BlueprintAttribute, PluginProps } from '../types'
import { createFormConfigs, FormConfig } from './util/CreateConfig'
import { isPrimitive } from '../pluginUtils'

interface Props extends PluginProps {
  onSubmit: (data: any) => void
}

export const EditPlugin = (props: Props) => {
  const configs: FormConfig[] = createFormConfigs(props)
  return (
    <div>
      {configs.map((config: any, index: number) => {
        const attribute: BlueprintAttribute = config.attribute
        const showLabel =
          attribute.dimensions !== '*' && !isPrimitive(attribute.type)
        return (
          <div key={'form' + index} style={{ marginBottom: 20 }}>
            {showLabel && (
              <div style={{ fontSize: 'bold' }}>{config.attribute.name}</div>
            )}
            <Form
              schema={config.template}
              formData={config.data || {}}
              uiSchema={config.uiSchema || {}}
              fields={{
                attribute: AttributeWidget,
                hidden: () => <div />,
              }}
              onSubmit={props.onSubmit}
            />
          </div>
        )
      })}
    </div>
  )
}
