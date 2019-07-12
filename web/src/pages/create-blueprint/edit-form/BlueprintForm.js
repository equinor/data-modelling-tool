import React from 'react'
import Form from 'react-jsonschema-form'
import Header from '../../../components/Header'

import toJsonSchema from 'to-json-schema'
import { Actions } from '../blueprint/CreateBluePrintReducer'
import { Pre } from '../preview/BlueprintPreview'

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
  return (
    <React.Fragment>
      <Header>
        <h3>Edit blueprint</h3>
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
  // not expecting a lot different templates. Consider using a dropdown in the form, to choose different template.
  const [params] = useAxios('/api/templates/simos-template.json')
  const { data, loading } = params
  if (loading) {
    return <div>Loading...</div>
  }
  // const node = state.nodes[selectedTemplatePath]
  // const isTemplate = node && node.endpoint.indexOf('/templates') === -1
  const isTemplate = false
  if (isTemplate) {
    return (
      <div>
        <Pre>{JSON.stringify(props.formData, null, 2)}</Pre>
      </div>
    )
  }

  return <BluePrintTemplateFormComponent {...props} schema={data} />
}

const BluePrintTemplateFormComponent = props => {
  const {
    schema,
    state: { selectedTemplatePath },
    dispatch,
  } = props
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
  // need a ui-template.
  // const jsonSchema = Object.assign({}, modelSchema, {
  //   required: ['name', 'description', 'properties'],
  // })

  const formData = {
    properties: [],
  }
  return (
    <Form
      formData={formData}
      schema={schema}
      onSubmit={onSubmit}
      onChange={log('change')}
      onError={log('errors')}
    />
  )
}
