import React from 'react'
import styled from 'styled-components'
import toJsonSchema from 'to-json-schema'
import Header from '../../../components/Header'
import { Actions } from '../existing/TreeViewExistingReducer'
import axios from 'axios'

export const Pre = styled.pre`
  white-space: -moz-pre-wrap; /* Mozilla, supported since 1999 */
  white-space: -pre-wrap; /* Opera */
  white-space: -o-pre-wrap; /* Opera */
  white-space: pre-wrap; /* CSS3 - Text module (Candidate Recommendation) http://www.w3.org/TR/css3-text/#white-space */
  word-wrap: break-word; /* IE 5.5+ */
`

export default props => {
  const { state, filesDispatch } = props
  //merge the nodes with formData.
  // const json = values(state.formData)
  //   .filter(item => item)
  //   .reduce((acc, current) => {
  //     return Object.assign(acc, current)
  //   }, {})
  const formData = state.formData[state.selectedTemplatePath]
  const jsonSchema = toJsonSchema(formData || null)

  const previewJson = fillInFormData(formData, jsonSchema)
  return (
    <div>
      <Header>
        <h3>Preview Blueprint</h3>
        <SaveButton
          jsonSchema={previewJson}
          path={state.selectedTemplatePath}
          filesDispatch={filesDispatch}
        />
      </Header>
      <div>
        <Pre>{JSON.stringify(previewJson, null, 2)}</Pre>
      </div>
    </div>
  )
}

const SaveButton = props => {
  const { jsonSchema, path, filesDispatch } = props
  const newPath = path.substr(0, path.lastIndexOf('/'))
  const title =
    jsonSchema.properties &&
    jsonSchema.properties.title &&
    jsonSchema.properties.title.value.trim()
  const disabled = title === undefined
  return (
    <button
      disabled={disabled}
      onClick={() => {
        if (disabled) {
          alert('jsonschema has no title.')
          return
        }
        const url = `api/blueprints${newPath}/${title}.json`
        axios({
          method: 'put',
          url,
          data: jsonSchema,
          responseType: 'json',
        })
          .then(function(response) {
            const id = response.data.replace('blueprints', '')
            filesDispatch(
              Actions.addFile({ path: id, title }, 'api/blueprints')
            )
          })
          .catch(e => {
            console.error(e)
          })
      }}
    >
      Save
    </button>
  )
}

export function fillInFormData(formData, jsonSchema) {
  if (Object.keys(jsonSchema).length > 1) {
    if (jsonSchema.properties) {
      if (jsonSchema.properties.title) {
        jsonSchema.properties.title.value = formData.title
      }
    }
    jsonSchema.properties.description.value = formData.description
  }
  return jsonSchema
}
