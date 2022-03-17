import TextWidget from '../widgets/TextWidget'
import React from 'react'
// @ts-ignore
import { Controller, useFormContext } from 'react-hook-form'
import { StringFieldProps } from '../types'

export const StringField = (props: StringFieldProps) => {
  const { control } = useFormContext()
  const { namePath, displayLabel, defaultValue, optional } = props

  // TODO: const Widget = getWidget(schema, widget, widgets);

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
      }) => (
        <TextWidget
          {...props}
          id={namePath}
          label={displayLabel}
          inputRef={ref}
          helperText={error?.message}
          variant={invalid ? 'error' : 'default'}
        />
      )}
    />
  )
}
