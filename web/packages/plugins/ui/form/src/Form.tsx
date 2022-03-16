import * as React from 'react'

// @ts-ignore
import { useForm, FormProvider, TFieldValues } from 'react-hook-form'
import { Button } from '@equinor/eds-core-react'
import { ObjectField } from './fields/ObjectField'
import { UnpackNestedValue } from 'react-hook-form/dist/types/form'
import { FormProps } from './types'

export const Form = (props: FormProps) => {
  const { type, onSubmit, formData } = props

  const methods = useForm({
    // Set initial state.
    defaultValues: formData || {},
  })

  // Every react hook form controller needs to have unique name.
  const namePath: string = ''

  const handleSubmit = methods.handleSubmit(
    (data: UnpackNestedValue<TFieldValues>, errors: any) => {
      // if (errors) console.debug(errors);
      if (onSubmit) onSubmit(data)
    }
  )

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit}>
        {type && <ObjectField namePath={namePath} type={type} />}
        <Button type="submit">Submit</Button>
      </form>
    </FormProvider>
  )
}
