import React, { useState } from 'react'
import Form from 'react-jsonschema-form'
import { Props as DocumentFinderProps } from '../form-rjsf-fields/DocumentFinderWidget'
import DocumentFinderWidget from '../form-rjsf-fields/DocumentFinderWidget'
import { Blueprint } from '../types'
import { findRecipe, findUiAttribute } from '../pluginUtils'
import { castValues } from '../form_rjsf_util/utilFormData'
import { AttributeWidget } from '../form-rjsf-fields/Attribute'
import { CollapsibleField } from '../form-rjsf-fields/CollapsibleField'

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

export default (props: Props) => {
  const { document, template, onSubmit, blueprint, blueprints } = props
  const [data, setData] = useState(document)
  const schema = template.schema
  const uiSchema = template.uiSchema

  //support AttributeWidget
  appendAttributes(blueprint, blueprints, uiSchema)

  const formData = castValues(blueprint, data)
  return (
    <Form
      formData={formData || {}}
      schema={schema}
      uiSchema={uiSchema || {}}
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

function appendAttributes(blueprint: any, blueprints: any, uiSchema: any) {
  //only way to pass properties to a field is adding them to uiSchema next to the field.
  //for now, only support attribute field for blueprints.
  if (uiSchema && uiSchema.attributes) {
    const uiRecipe = findRecipe(blueprint, 'EDIT')
    if (uiRecipe) {
      const uiAttribute = findUiAttribute(uiRecipe, 'attributes')
      if (uiAttribute.field === 'attribute') {
        const blueprintAttributes = blueprints.find(
          (blueprint: Blueprint) => blueprint.name === 'BlueprintAttribute'
        )
        if (!uiSchema.attributes.items) {
          ;(uiSchema as any).attributes.items = {
            attributes:
              (blueprintAttributes && blueprintAttributes.attributes) || [],
            'ui:field': 'attribute',
          }
        }
      }
    }
  }
}
