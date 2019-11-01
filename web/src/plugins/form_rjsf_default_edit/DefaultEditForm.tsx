import React, { useState } from 'react'
import Form from 'react-jsonschema-form'
import {
  AttributeWidget,
  blueprintAttributes,
} from '../form-rjsf-widgets/Attribute'
import { CollapsibleField } from '../widgets/CollapsibleField'
import DocumentFinderWidget from "../form-rjsf-widgets/DocumentFinderWidget";
import {Blueprint} from "../types";

interface Props {
  document: Blueprint | {}
  template: any
  onSubmit: (data: any) => void
}
export default ({ document, template, onSubmit }: Props) => {
  const [data, setData] = useState(document)
  const schema = template.schema
  const uiSchema = template.uiSchema

  //only way to pass properties to a field is adding them to uiSchema next to the field.
  //for now, only support attribute field for blueprints.
  if (uiSchema.attributes && uiSchema.attributes.items) {
    ;(uiSchema as any)['attributes']['items'].attributes = blueprintAttributes
  }
  return (
    <Form
      formData={data}
      schema={schema}
      uiSchema={uiSchema}
      //@ts-ignore
      fields={{
        attribute: AttributeWidget,
        collapsible: CollapsibleField,
        type: DocumentFinderWidget
      }}
      onSubmit={onSubmit}
      onChange={schemas => {
        setData(schemas.formData)
      }}
    />
  )
}
