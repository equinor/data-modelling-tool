import styled from 'styled-components'
import React, { useState } from 'react'
import { TTask } from '../Types'
import { Button, TextField } from '@equinor/eds-core-react'

type Errors = {
  [key: string]: any
}

type CreateFormProps = {
  task: TTask
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

const EditTaskForm = (props: CreateFormProps) => {
  const { onSubmit, task } = props
  const [error, setError] = useState<Errors>({
    name: '',
    description: '',
  })
  const [analysis, setAnalysis] = useState<TTask>({
    name: task.name || '',
    description: task.description || '',
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
          id="name"
          label="Name"
          placeholder="Analysis name"
          onChange={handleInputChange}
          helperText={
            error.name
              ? error.name
              : 'Provide the name of the analysis to be created'
          }
          variant={error.name ? 'error' : 'default'}
          value={task.name}
        />
        <TextField
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
          value={task.description}
        />
      </Wrapper>
      <Button
        type="submit"
        style={{ marginTop: '14px' }}
        onSubmit={formHandler}
      >
        Create
      </Button>
    </form>
  )
}

export default EditTaskForm