import * as React from 'react'
import { RequiredGroup } from './components/DisabledData'

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
