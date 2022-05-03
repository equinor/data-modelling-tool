import styled from 'styled-components'
import React, { useState } from 'react'
import { TAnalysis } from '../Types'
import { Button, TextField } from '@equinor/eds-core-react'
import { INPUT_FIELD_WIDTH } from '@dmt/common'

type Errors = {
  [key: string]: any
}

type CreateFormProps = {
  data: any
  onSubmit: Function
}

const Wrapper = styled.div`
  margin: 32px;
  display: grid;
  grid-gap: 32px;
  grid-template-columns: repeat(1, fit-content(100%));
`

const hasErrors = (error: Errors) =>
  error['name'] !== '' || error['description'] !== ''

const CreateAnalysisForm = (props: CreateFormProps) => {
  const { onSubmit, data } = props
  const [error, setError] = useState<Errors>({
    name: '',
    description: '',
  })
  const [analysis, setAnalysis] = useState<TAnalysis>({
    name: data?.name || '',
    description: data?.description || '',
  })

  const formHandler = (event: any) => {
    event.preventDefault()

    let formErrors: Errors = {
      name: '',
      description: '',
    }

    const singleWordFormat = new RegExp('^[A-Za-z0-9-_]+$')
    if (!singleWordFormat.test(analysis.name)) {
      formErrors['name'] =
        'Invalid operation name! (you cannot have empty name or use any special characters).'
    }

    if (!hasErrors(formErrors)) {
      onSubmit(analysis)
    } else {
      setError(formErrors)
    }
  }

  const handleInputChange = (event: any) => {
    setAnalysis({
      ...analysis,
      [event.target.id]: event.target.value,
    })
  }

  return (
    <form onSubmit={formHandler}>
      <Wrapper>
        <TextField
          style={{ width: INPUT_FIELD_WIDTH }}
          id="name"
          label="Name"
          placeholder="Analysis name"
          onChange={handleInputChange}
          helperText={
            error.name ? error.name : 'Provide the name of the analysis'
          }
          variant={error.name ? 'error' : 'default'}
          value={analysis.name}
        />
        <TextField
          style={{ width: INPUT_FIELD_WIDTH }}
          id="description"
          label="Description"
          placeholder="Description"
          onChange={handleInputChange}
          helperText={
            error.description
              ? error.description
              : 'Short description about the analysis'
          }
          variant={error.description ? 'error' : 'default'}
          value={analysis.description}
        />
        <div>
          <Button
            type="submit"
            style={{ marginTop: '14px' }}
            onSubmit={formHandler}
          >
            Create
          </Button>
        </div>
      </Wrapper>
    </form>
  )
}

export default CreateAnalysisForm
