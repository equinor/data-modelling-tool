import React from 'react'
import Form from 'react-jsonschema-form'
import Header from '../../../components/Header'
import useAxios, { configure } from 'axios-hooks'
import Axios from 'axios'
import LRU from 'lru-cache'
import toJsonSchema from 'to-json-schema'
import { Actions } from '../blueprint/CreateBluePrintReducer'
import { Pre } from '../preview/BlueprintPreview'

const log = type => console.log.bind(console, type)

//avoid request if the file is cached.
const cache = new LRU({ max: 10 })
const axios = Axios.create()
configure({ axios, cache })

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
  let { state } = props
  const { selectedTemplatePath } = state
  const node = state.nodes[selectedTemplatePath]
  const url = node.endpoint + node.path
  const [params, refetch] = useAxios(url)
  const { data, loading, error } = params

  if (loading) return <p>Loading...</p>
  // Need to lookup cache since error is not reset.
  // https://github.com/simoneb/axios-hooks/issues/8
  const cacheHasKey = cache.keys().filter(key => key.indexOf(url) > -1).length
  if (!cacheHasKey && error) {
    return <p>Error!</p>
  }

  const isTemplate = node && node.endpoint.indexOf('/templates') === -1
  console.log(node.endpoint, isTemplate)
  if (isTemplate) {
    return (
      <div>
        <Pre>{JSON.stringify(props.formData, null, 2)}</Pre>
      </div>
    )
  }
  const stateFormData = state.formData[selectedTemplatePath]
  const formData = stateFormData || {}

  return (
    <BluePrintTemplateFormComponent
      {...props}
      schema={data}
      formData={formData}
    />
  )
}

const BluePrintTemplateFormComponent = props => {
  const {
    formData,
    schema,
    state: { selectedTemplatePath },
    dispatch,
  } = props
  console.log(selectedTemplatePath)
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
