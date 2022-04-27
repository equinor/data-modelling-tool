import React from 'react'
// @ts-ignore
import { Controller, useFormContext } from 'react-hook-form'
import { BooleanFieldProps } from '../types'
import { useRegistryContext } from '../RegistryContext'

export const BooleanField = (props: BooleanFieldProps) => {
  const { control } = useFormContext()
  const { namePath, displayLabel, defaultValue, uiAttribute } = props

  const { getWidget } = useRegistryContext()

  // We need to convert default values coming from the API since they are always strings
  const usedDefaultValue = defaultValue !== undefined && defaultValue == 'True'

  let defaultWidget = uiAttribute ? uiAttribute.widget : 'CheckboxWidget'
  const Widget = getWidget(namePath, defaultWidget)

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
