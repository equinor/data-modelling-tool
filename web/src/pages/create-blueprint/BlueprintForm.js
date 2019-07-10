import React, { useEffect } from 'react'
import Form from 'react-jsonschema-form'
import Header from '../../components/Header'
import axios from 'axios'
import toJsonSchema from 'to-json-schema'
import { Actions } from './blueprint/CreateBluePrintReducer'

const log = type => console.log.bind(console, type)

export default props => {
  const {
    state: { selectedTemplatePath },
  } = props
  return (
    <React.Fragment>
      <Header>
        <h3>Edit model</h3>
        <div style={{ paddingRight: 10 }}>{selectedTemplatePath}</div>
      </Header>

      <div style={{ marginTop: 20, maxWidth: 400, padding: 20 }}>
        <BluePrintTemplateForm {...props} />
      </div>
    </React.Fragment>
  )
}

const BluePrintTemplateForm = props => {
  let { state, dispatch } = props
  const { selectedTemplatePath, nodes, modelFiles, formData } = state
  useEffect(() => {
    // Update the document title using the browser API
    if (selectedTemplatePath) {
      const node = state.nodes[selectedTemplatePath]
      const url = node.endpoint + node.path
      axios({
        method: 'get',
        url,
        responseType: 'json',
      })
        .then(function(response) {
          dispatch(Actions.fetchModel(node.path, response.data))
        })
        .catch(e => {
          console.error(e)
        })
    }
  }, [selectedTemplatePath])

  if (selectedTemplatePath === null) {
    return null
  }
  const modelSchema = modelFiles[selectedTemplatePath]

  if (!modelSchema) {
    return <div>schema not found. </div>
  }

  if (
    modelSchema.endpoint &&
    modelSchema.endpoint.indexOf('/templates') === -1
  ) {
    return <div>Display preview of blueprint. </div>
  }
  // need a ui-template.
  // const jsonSchema = Object.assign({}, modelSchema, {
  //   required: ['name', 'description', 'properties'],
  // })

  const stateFormData = formData[selectedTemplatePath]
  const data = stateFormData || {}

  const onSubmit = schemas => {
    try {
      //validate jsonSchema.
      toJsonSchema(schemas.formData)
      dispatch(Actions.updateFormData(selectedTemplatePath, schemas.formData))
    } catch (e) {
      //todo fix validation. Set required on fields. And strip optional fields with null values from formdata.
      alert('not valid jsonschema')
    }
  }

  return (
    <Form
      formData={data}
      schema={modelSchema}
      onSubmit={onSubmit}
      onChange={log('change')}
      onError={log('errors')}
    />
  )
}
