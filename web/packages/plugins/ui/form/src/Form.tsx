import * as React from 'react'

// @ts-ignore
import { useForm, FormProvider, TFieldValues } from 'react-hook-form'
import { Button } from '@equinor/eds-core-react'
import { ObjectField } from './fields/ObjectField'
import { UnpackNestedValue } from 'react-hook-form/dist/types/form'
import { FormProps } from './types'
import { RegistryProvider } from './RegistryContext'
import styled from 'styled-components'

const Wrapper = styled.div`
  max-width: 650px;
`

export const Form = (props: FormProps) => {
  const {
    type,
    onSubmit,
    onChange,
    formData,
    widgets,
    config,
    updateDocument,
    dataSourceId,
    documentId,
    onOpen,
  } = props

  console.log(formData)

  const methods = useForm({
    // Set initial state.
    defaultValues: formData || {},
  })

  // Every react hook form controller needs to have a unique name
  const namePath: string = ''

  const handleSubmit = methods.handleSubmit(
    (data: UnpackNestedValue<TFieldValues>, errors: any) => {
      console.log(data)
      if (errors) console.debug(errors)
      if (onChange) {
        console.log('onChange')
        onChange(data)
      } else if (onSubmit) {
        console.log('onSubmit')
        onSubmit(data)
      } else if (updateDocument) {
        console.log('updateDocument')
        updateDocument(data, true)
      }
    }
  )

  methods.watch((data: any) => {
    // @ts-ignore
    console.log(data)
    //onChange && data && onChange(data);
  })

  return (
    <Wrapper>
      <FormProvider {...methods}>
        <RegistryProvider
          onOpen={onOpen}
          widgets={widgets}
          dataSourceId={dataSourceId}
          documentId={documentId}
        >
          <form onSubmit={handleSubmit}>
            {type && (
              <ObjectField config={config} namePath={namePath} type={type} />
            )}
            <Button type="submit">Submit</Button>
          </form>
        </RegistryProvider>
      </FormProvider>
    </Wrapper>
  )
}
