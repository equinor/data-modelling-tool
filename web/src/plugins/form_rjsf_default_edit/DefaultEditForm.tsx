import React, { useState } from 'react'
import Form from 'react-jsonschema-form'
import { AttributeWidget } from '../form-rjsf-widgets/Attribute'
import { CollapsibleField } from '../widgets/CollapsibleField'
import { Props as DocumentFinderProps } from '../form-rjsf-widgets/DocumentFinderWidget'
import DocumentFinderWidget from '../form-rjsf-widgets/DocumentFinderWidget'
import { Blueprint } from '../types'
import { castValues } from '../form-rjsf-widgets/utilFormData'

interface Props {
  document: Blueprint | {}
  blueprints: Blueprint[]
  blueprint: Blueprint
  template: any
  onSubmit: (data: any) => void
}

const DocumentFinderWrapper = (props: DocumentFinderProps) => (
  <div>
    <b>type</b>
    <DocumentFinderWidget {...props} />
  </div>
)

export default ({
  document,
  template,
  onSubmit,
  blueprint,
  blueprints,
}: Props) => {
  const [data, setData] = useState(document)
  const schema = template.schema
  const uiSchema = template.uiSchema

  //only way to pass properties to a field is adding them to uiSchema next to the field.
  //for now, only support attribute field for blueprints.
  if (uiSchema.attributes) {
    const blueprintAttributes = blueprints.find(
      (blueprint: Blueprint) => blueprint.name === 'BlueprintAttribute'
    )
    if (!uiSchema.attributes.items) {
      ;(uiSchema as any).attributes.items = {
        attributes: blueprintAttributes && blueprintAttributes.attributes || [],
        'ui:field': 'attribute'
      }
    }
  }

  const formData = castValues(blueprint, data)
  return (
    <Form
      formData={formData}
      schema={schema}
      uiSchema={uiSchema}
      //@ts-ignore
      fields={{
        attribute: AttributeWidget,
        // collapsible: CollapsibleField,
        type: DocumentFinderWrapper,
      }}
      onSubmit={onSubmit}
      onChange={schemas => {
        setData(schemas.formData)
      }}
    />
  )
}
