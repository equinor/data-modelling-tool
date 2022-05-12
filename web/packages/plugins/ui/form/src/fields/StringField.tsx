import TextWidget from '../widgets/TextWidget'
import React from 'react'
// @ts-ignore
import { Controller, useFormContext } from 'react-hook-form'
import { StringFieldProps } from '../types'
import { useRegistryContext } from '../RegistryContext'

const formatDate = (date: string) => {
  return new Date(date).toLocaleString(navigator.language)
}

export const StringField = (props: StringFieldProps) => {
  const { control } = useFormContext()
  const { namePath, displayLabel, defaultValue, optional, uiAttribute } = props

  const { getWidget } = useRegistryContext()

  console.log(namePath, uiAttribute)

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
        field: { ref, value, ...props },
        // @ts-ignore
        fieldState: { invalid, error },
      }) => {
        // Support date-time format, and make it default to readonly
        let readOnly = false
        if (uiAttribute && uiAttribute.format === 'date-time') {
          value = formatDate(value)
          readOnly = true
        }
        return (
          <Widget
            readOnly={readOnly}
            {...props}
            value={value}
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
