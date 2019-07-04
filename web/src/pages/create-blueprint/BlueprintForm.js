import React, { useEffect } from 'react'
import Form from 'react-jsonschema-form'
import { Actions } from '../../components/tree-view/TreeReducer'
import { Actions as ModelActions } from '../../reducers/ModelsReducer'
import Header from '../../components/Header'
import axios from 'axios'

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
  let {
    selectedTemplate,
    state,
    dispatch,
    modelFiles,
    dispatchModelFiles,
  } = props
  useEffect(() => {
    // Update the document title using the browser API
    if (selectedTemplate) {
      const url = selectedTemplate.endpoint + selectedTemplate.path
      axios({
        method: 'get',
        url,
        responseType: 'json',
      })
        .then(function(response) {
          dispatchModelFiles(
            ModelActions.fetchModel(selectedTemplate.path, response.data)
          )
        })
        .catch(e => {
          console.error(e)
        })
    }
  }, [selectedTemplate])

  if (selectedTemplate === null) {
    return null
  }
  console.log(modelFiles)
  const modelSchema = modelFiles[selectedTemplate.path]

  if (!modelSchema) {
    return <div>schema not found. </div>
  }

  const jsonSchema = Object.assign({}, modelSchema, {
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
