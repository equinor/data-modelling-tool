import React from 'react'
import Form from 'react-jsonschema-form'
import AttributeWidget from '../../components/widgets/Attribute'
import { PluginProps } from '../types'
import { createFormConfigs, FormConfig } from './util/CreateConfig'

interface Props extends PluginProps {
  onSubmit: (data: any) => void
}

export const EditPlugin = (props: Props) => {
  const configs: FormConfig[] = createFormConfigs(props)
  return (
    <div>
      {configs.map((config: any, index: number) => {
        return (
          <div key={'form' + index} style={{ marginBottom: 20 }}>
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
