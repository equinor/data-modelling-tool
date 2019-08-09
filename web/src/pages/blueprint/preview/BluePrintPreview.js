import React from 'react'
import styled from 'styled-components'
import Header from '../../../components/Header'

export const Pre = styled.pre`
  white-space: -moz-pre-wrap; /* Mozilla, supported since 1999 */
  white-space: -pre-wrap; /* Opera */
  white-space: -o-pre-wrap; /* Opera */
  white-space: pre-wrap; /* CSS3 - Text module (Candidate Recommendation) http://www.w3.org/TR/css3-text/#white-space */
  word-wrap: break-word; /* IE 5.5+ */
`

export default props => {
  const { data } = props
  return (
    <div>
      <Header>
        <h3>Preview Blueprint</h3>
      </Header>
      <div>
        <Pre>{JSON.stringify(data, null, 2)}</Pre>
      </div>
    </div>
  )
}
