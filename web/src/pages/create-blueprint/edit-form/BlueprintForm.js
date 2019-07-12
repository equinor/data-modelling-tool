import React from 'react'
import Form from 'react-jsonschema-form'
import Header from '../../../components/Header'

import toJsonSchema from 'to-json-schema'
import { Actions } from '../blueprint/CreateBluePrintReducer'

import useAxios, { configure } from 'axios-hooks'
import Axios from 'axios'
import LRU from 'lru-cache'
//avoid request if the file is cached.
const cache = new LRU({ max: 10 })
const axios = Axios.create()
configure({ axios, cache })
const log = type => console.log.bind(console, type)

export default props => {
  const {
    state: { selectedTemplatePath },
  } = props
  if (!selectedTemplatePath) {
    return null
  }
  const isEdit = selectedTemplatePath.indexOf('.json') > -1
  return (
    <React.Fragment>
      <Header>
        <h3>{isEdit ? 'Edit' : 'Create'} blueprint</h3>
        <div style={{ paddingRight: 10 }}>{selectedTemplatePath}</div>
      </Header>

      <div style={{ marginTop: 20, maxWidth: 400, padding: 20 }}>
        {// check selectedTemplate to avoid having a conditional before a hook in BluePrintTemplateForm.
        selectedTemplatePath && <BluePrintTemplateFormContainer {...props} />}
      </div>
    </React.Fragment>
  )
}

const BluePrintTemplateFormContainer = props => {
  const {
    state: { selectedTemplatePath },
  } = props
  // not expecting a lot different templates. Consider using a dropdown in the form, to choose different template.
  const [params] = useAxios('/api/templates/simos-template.json')
  const { loading } = params

  let formData = null

  const path = selectedTemplatePath
  const [fileParams] = useAxios('/api/blueprints' + path)

  if (loading || fileParams.loading) {
    return <div>Loading...</div>
  }
  if (path.indexOf('.json') > -1) {
    formData = fileParams.data
  }

  return (
    <BluePrintTemplateFormComponent
      {...props}
      schema={params.data}
      formData={formData}
    />
  )
}

const BluePrintTemplateFormComponent = props => {
  const {
    schema,
    formData,
    state: { selectedTemplatePath },
    dispatch,
  } = props
  const onSubmit = schemas => {
    console.log(JSON.stringify(schemas.formData))
    if (formData) {
      alert('editing is not supported. ')
      return
    }

    try {
      //validate jsonSchema.
      toJsonSchema(schemas.formData)
      dispatch(Actions.updateFormData(selectedTemplatePath, schemas.formData))
    } catch (e) {
      //todo fix validation. Set required on fields. And strip optional fields with null values from formdata.
      alert('not valid jsonschema')
    }
  }

  let jsonFormData = {
    properties: [],
  }
  if (formData) {
    jsonFormData = formData
  }
  return (
    <Form
      formData={jsonFormData}
      schema={schema}
      onSubmit={onSubmit}
      onChange={log('change')}
      onError={log('errors')}
    />
  )
}
