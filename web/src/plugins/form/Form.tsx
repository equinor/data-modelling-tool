import React, { useState } from 'react'
import Form from 'react-jsonschema-form'
import BlueprintPreview from '../preview/PreviewPlugin'
import Tabs, { Tab, TabPanel, TabList } from '../../components/Tabs'
import AttributeWidget from '../../components/widgets/Attribute'
import '../../pages/blueprints/blueprint/form-styles.css'

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
      fields={{ attribute: AttributeWidget }}
      onSubmit={onSubmit}
      onChange={schemas => {
        setData(schemas.formData)
      }}
    />
  )
}
