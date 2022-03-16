import Widget from '../widgets/CheckboxWidget'
import React from 'react'
// @ts-ignore
import { Controller, useFormContext } from 'react-hook-form'
import { BooleanFieldProps } from '../types'

export const BooleanField = (props: BooleanFieldProps) => {
  const { control } = useFormContext()
  const { namePath, label, name, defaultValue } = props

  // We need to convert default values coming from the API since they are always strings
  const usedDefaultValue = defaultValue !== undefined && defaultValue == 'True'

  // TODO: const Widget = getWidget(schema, widget, widgets);

  return (
    <Controller
      name={namePath}
      control={control}
      rules={
        {
          // TODO: required: 'Required'
        }
      }
      defaultValue={usedDefaultValue}
      render={({
        // @ts-ignore
        field: { ref, value, ...props },
        // @ts-ignore
        fieldState: { invalid, error },
      }) => (
        <Widget
          {...props}
          id={namePath}
          value={value}
          label={label === undefined || label === '' ? name : label}
          inputRef={ref}
          helperText={error?.message}
          variant={invalid ? 'error' : 'default'}
        />
      )}
    />
  )
}
