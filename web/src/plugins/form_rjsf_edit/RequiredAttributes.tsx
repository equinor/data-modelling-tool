import styled from 'styled-components'
import React from 'react'

const RequiredGroup = styled.code`
  border: 1px solid;
  margin: 2px;
  padding: 5px;
  border-radius: 5px;
  display: flex;
  flex-flow: column;
`

interface FormData {
  name: string
  attributeType: string
}

export const RequiredAttributesGroup = (formData: FormData) => {
  return (
    <RequiredGroup>
      <div>
        <b>name: </b>
        {formData.name}
      </div>
      <div>
        <b>attributeType: </b>
        {formData.attributeType}
      </div>
      <div>
        <b>optional: </b>false
      </div>
    </RequiredGroup>
  )
}
