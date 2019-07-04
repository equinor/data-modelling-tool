import React from 'react'
import Form from 'react-jsonschema-form'
import { HeaderItem, HeaderWrapper } from './BlueprintPreview'
import BasicBluePrintSchema from './json-templates/basic-blueprint-template'
import { Actions } from '../../components/tree-view/TreeReducer'

const log = type => console.log.bind(console, type)

export default props => {
  const { selectedTemplate } = props
  return (
    <div>
      <Header selectedTemplate={selectedTemplate} />
      <div style={{ marginTop: 20, maxWidth: 400, padding: 20 }}>
        <BluePrintTemplateForm {...props} />
      </div>
    </div>
  )
}

const Header = props => {
  const { selectedTemplate } = props
  return (
    <HeaderWrapper>
      <HeaderItem>
        <h3>Edit model</h3>
      </HeaderItem>
      <HeaderItem>
        <div style={{ paddingRight: 10 }}>
          {selectedTemplate && selectedTemplate.path}
        </div>
      </HeaderItem>
    </HeaderWrapper>
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
