import React from 'react'
import styled from 'styled-components'
import toJsonSchema from 'to-json-schema'
import values from 'lodash/values'
import Header from '../../components/Header'

const Pre = styled.pre`
  white-space: -moz-pre-wrap; /* Mozilla, supported since 1999 */
  white-space: -pre-wrap; /* Opera */
  white-space: -o-pre-wrap; /* Opera */
  white-space: pre-wrap; /* CSS3 - Text module (Candidate Recommendation) http://www.w3.org/TR/css3-text/#white-space */
  word-wrap: break-word; /* IE 5.5+ */
`

export default props => {
  const { state } = props

  //merge the nodes with formData.
  const json = values(state.formData)
    .filter(item => item)
    .reduce((acc, current) => {
      return Object.assign(acc, current)
    }, {})
  const jsonSchema = toJsonSchema(json)
  return (
    <div>
      <Header>
        <h3>Preview Blueprint</h3>
        <button disabled={true}>Save</button>
      </Header>
      <div>
        <Pre>{JSON.stringify(jsonSchema, null, 2)}</Pre>
      </div>
    </div>
  )
}
