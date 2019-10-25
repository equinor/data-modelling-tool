import React, { useState } from 'react'
import Form from 'react-jsonschema-form'
import { attributeWidget } from '../../components/widgets/Attribute'

interface Props {
  document: any
  template: any
  onSubmit: (data: any) => void
}

export default ({ document, template, onSubmit }: Props) => {
  const [data, setData] = useState({ ...document })
  const schema = template.schema
  const uiSchema = template.uiSchema
  return (
    <Form
      formData={data || {}}
      schema={schema}
      uiSchema={uiSchema}
      fields={{ attribute: attributeWidget() }}
      onSubmit={onSubmit}
      onChange={schemas => {
        setData(schemas.formData)
      }}
    />
  )
}
