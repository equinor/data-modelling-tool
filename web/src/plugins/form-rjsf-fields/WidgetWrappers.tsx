import React from 'react'
import { FieldProps } from 'react-jsonschema-form'

export interface CommonWidgetProps {
  registry: FieldProps['Registry']
  idSchema: any
  value: string
  label: string
}

interface TextWidgetProps extends CommonWidgetProps {
  onChange: (value: string) => void
}

export function CreateTextWidget(props: TextWidgetProps) {
  const { registry, idSchema, onChange, value, label } = props
  const id = idSchema.$id
  return (
    <props.registry.widgets.TextWidget
      id={id}
      onChange={onChange}
      value={value || ''}
      readonly={false}
      autofocus={false}
      onBlur={() => {}}
      onFocus={() => {}}
      required={false}
      disabled={false}
      options={{}}
      // BaseWidget from registry.widgets is needed.
      registry={registry}
      formContext={{}}
      label={label}
      schema={{ type: 'string' }}
    />
  )
}
