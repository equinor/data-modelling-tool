import React from 'react'
import styled from 'styled-components'
import Header from '../../../components/Header'
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
  const formData = state.formData[state.selectedTemplatePath]
  return (
    <div>
      <Header>
        <h3>Preview Blueprint</h3>
        <SaveButton
          formData={formData}
          state={state}
          path={state.selectedTemplatePath}
          filesDispatch={filesDispatch}
        />
      </Header>
      <div>
        <Pre>{JSON.stringify(formData, null, 2)}</Pre>
      </div>
    </div>
  )
}

const SaveButton = props => {
  const { formData, path } = props
  const title = formData && formData.title
  const disabled = title === undefined
  return (
    <button
      disabled={disabled}
      onClick={() => {
        if (disabled) {
          alert('jsonschema has no title.')
          return
        }
        const url = `api/blueprints${path}/${title}.json`
        axios({
          method: 'put',
          url,
          data: formData,
          responseType: 'json',
        })
          .then(function(response) {
            console.log(response)
            //@todo refetch blueprints
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
