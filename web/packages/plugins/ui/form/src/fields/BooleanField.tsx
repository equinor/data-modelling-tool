import Widget from '../widgets/CheckboxWidget'
import React from 'react'
// @ts-ignore
import { Controller, useFormContext } from 'react-hook-form'
import { BooleanFieldProps } from '../types'

export const BooleanField = (props: BooleanFieldProps) => {
  const { control } = useFormContext()
  const { namePath, displayLabel, defaultValue } = props

  // We need to convert default values coming from the API since they are always strings
  const usedDefaultValue = defaultValue !== undefined && defaultValue == 'True'

  // TODO: const Widget = getWidget(schema, widget, widgets);

  return (
    <Controller
      name={namePath}
      control={control}
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
          label={displayLabel}
          inputRef={ref}
          helperText={error?.message}
          variant={invalid ? 'error' : 'default'}
        />
      )}
    />
  )
}
