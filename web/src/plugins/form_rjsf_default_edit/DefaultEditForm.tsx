import React, { useState } from 'react'
import Form from 'react-jsonschema-form'
import { AttributeWidget } from '../form-rjsf-widgets/Attribute'
import { CollapsibleField } from '../widgets/CollapsibleField'
import { Props as DocumentFinderProps } from '../form-rjsf-widgets/DocumentFinderWidget'
import DocumentFinderWidget from '../form-rjsf-widgets/DocumentFinderWidget'
import { Blueprint } from '../types'

interface Props {
  document: Blueprint | {}
  blueprints: Blueprint[]
  template: any
  onSubmit: (data: any) => void
}

const DocumentFinderWrapper = (props: DocumentFinderProps) => (
  <div>
    <b>type</b>
    <DocumentFinderWidget {...props} />
  </div>
)

export default ({ document, template, onSubmit, blueprints }: Props) => {
  const [data, setData] = useState(document)
  const schema = template.schema
  const uiSchema = template.uiSchema

  console.log(blueprints)
  //only way to pass properties to a field is adding them to uiSchema next to the field.
  //for now, only support attribute field for blueprints.
  if (uiSchema.attributes && uiSchema.attributes.items) {
    const blueprintAttributes = blueprints.find(
      (blueprint: Blueprint) => blueprint.name === 'BlueprintAttribute'
    )
    ;(uiSchema as any)['attributes']['items'].attributes =
      (blueprintAttributes && blueprintAttributes.attributes) || []
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
        type: DocumentFinderWrapper,
      }}
      onSubmit={onSubmit}
      onChange={schemas => {
        setData(schemas.formData)
      }}
    />
  )
}
