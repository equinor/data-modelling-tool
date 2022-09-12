import * as React from 'react'

import { useForm, FormProvider } from 'react-hook-form'
import { Button } from '@equinor/eds-core-react'
import { ObjectField } from './fields/ObjectField'
import { TFormProps } from './types'
import { RegistryProvider } from './RegistryContext'
import styled from 'styled-components'

const Wrapper = styled.div`
  max-width: 650px;
`

export const Form = (props: TFormProps) => {
  const {
    type,
    formData,
    widgets,
    config,
    onSubmit,
    dataSourceId,
    documentId,
    onOpen,
  } = props

  const methods = useForm({
    // Set initial state.
    defaultValues: formData || {},
  })

  // Every react hook form controller needs to have a unique name
  const namePath: string = ''

  const handleSubmit = methods.handleSubmit((data) => {
    if (onSubmit !== undefined) onSubmit(data)
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
