import TextWidget from '../widgets/TextWidget'
import React from 'react'
// @ts-ignore
import { Controller, useFormContext } from 'react-hook-form'
import { StringFieldProps } from '../types'
import { useRegistryContext } from '../RegistryContext'

export const StringField = (props: StringFieldProps) => {
  const { control } = useFormContext()
  const { namePath, displayLabel, defaultValue, optional, uiAttribute } = props

  const { getWidget } = useRegistryContext()

  let defaultWidget = uiAttribute ? uiAttribute.widget : 'TextWidget'
  const Widget = getWidget(namePath, defaultWidget)

  return (
    <Controller
      name={namePath}
      control={control}
      rules={{
        required: !optional,
      }}
      defaultValue={defaultValue || ''}
      render={({
        // @ts-ignore
        field: { ref, ...props },
        // @ts-ignore
        fieldState: { invalid, error },
      }) => {
        return (
          <Widget
            {...props}
            id={namePath}
            label={displayLabel}
            inputRef={ref}
            helperText={error?.message || error?.type}
            variant={invalid ? 'error' : 'default'}
          />
        )
      }}
    />
  )
}
