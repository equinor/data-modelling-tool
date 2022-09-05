import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { TNumberFieldProps } from '../types'
import { useRegistryContext } from '../RegistryContext'

// Taken from: https://github.com/rjsf-team/react-jsonschema-form/blob/cff979dae5348e9b100447641bcb53374168367f/packages/core/src/utils.js#L436
export const asNumber = (value: string): number | string => {
  if (value === '') {
    return value
  }
  if (/\.$/.test(value)) {
    // "3." can't really be considered a number even if it parses in js. The
    // user is most likely entering a float.
    return value
  }
  if (/\.0$/.test(value)) {
    // we need to return this as a string here, to allow for input like 3.07
    return value
  }
  const n = Number(value)
  const valid = typeof n === 'number' && !Number.isNaN(n)

  if (/\.\d*0$/.test(value)) {
    // It's a number, that's cool - but we need it as a string so it doesn't screw
    // with the user when entering dollar amounts or other values (such as those with
    // specific precision or number of significant digits)
    return value
  }

  return valid ? n : value
}

export const NumberField = (props: TNumberFieldProps) => {
  const { control } = useFormContext()
  const { namePath, displayLabel, defaultValue, optional, uiAttribute } = props

  const { getWidget } = useRegistryContext()

  const defaultWidget = uiAttribute ? uiAttribute.widget : 'TextWidget'
  const Widget = getWidget(namePath, defaultWidget)

  return (
    <Controller
      name={namePath}
      control={control}
      rules={{
        required: !optional,
        pattern: { value: /^[0-9]+$/g, message: 'Only digits allowed' },
      }}
      defaultValue={defaultValue || undefined}
      render={({
        field: { ref, onChange, ...props },
        fieldState: { invalid, error },
      }) => {
        // Convert to number
        const handleChange = (value: string) => {
          onChange(asNumber(value))
        }
        return (
          <Widget
            {...props}
            onChange={handleChange}
            type="number"
            id={namePath}
            label={displayLabel}
            inputRef={ref}
            helperText={error?.message}
            variant={invalid ? 'error' : 'default'}
          />
        )
      }}
    />
  )
}
