import TextWidget from '../widgets/TextWidget'
import React from 'react'
// @ts-ignore
import { Controller, useFormContext } from 'react-hook-form'

export const StringField = (props: any) => {
  const { control } = useFormContext()
  const { namePath, label, name, defaultValue } = props

  // TODO: const Widget = getWidget(schema, widget, widgets);

  return (
    <Controller
      name={namePath}
      control={control}
      rules={
        {
          // TODO: required: 'Required',
        }
      }
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
          label={label === undefined || label === '' ? name : label}
          inputRef={ref}
          helperText={error?.message}
          variant={invalid ? 'error' : 'default'}
        />
      )}
    />
  )
}
