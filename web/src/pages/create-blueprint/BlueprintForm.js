import React from 'react'
import Form from 'react-jsonschema-form'
import BasicBluePrintSchema from './json-templates/basic-blueprint-template'
import { Actions } from '../../components/tree-view/TreeReducer'
import Header from '../../components/Header'

const log = type => console.log.bind(console, type)

export default props => {
  const { selectedTemplate } = props
  return (
    <React.Fragment>
      <Header>
        <h3>Edit model</h3>
        <div style={{ paddingRight: 10 }}>
          {selectedTemplate && selectedTemplate.path}
        </div>
      </Header>

      <div style={{ marginTop: 20, maxWidth: 400, padding: 20 }}>
        <BluePrintTemplateForm {...props} />
      </div>
    </React.Fragment>
  )
}

const BluePrintTemplateForm = props => {
  let { selectedTemplate, state, dispatch } = props
  if (selectedTemplate === null) {
    return null
  }

  if (selectedTemplate.path.indexOf('/templates/basic') === -1) {
    return null
  }

  const jsonSchema = Object.assign({}, BasicBluePrintSchema, {
    required: ['name', 'description', 'properties'],
  })

  let formData = {}
  if (state[selectedTemplate.path] && state[selectedTemplate.path].formData) {
    formData = state[selectedTemplate.path].formData
  }
  const onSubmit = schemas => {
    dispatch(Actions.updateFormData(selectedTemplate.path, schemas.formData))
  }

  return (
    <Form
      formData={formData}
      schema={jsonSchema}
      onSubmit={onSubmit}
      onChange={log('change')}
      onError={log('errors')}
    />
  )
}
