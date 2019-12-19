import React, { useState } from 'react'
import Form from 'react-jsonschema-form'
import { AttributeWidget } from '../form-rjsf-widgets/Attribute'
import { CollapsibleField } from '../widgets/CollapsibleField'
import { Blueprint } from '../types'
import { castValues } from '../form-rjsf-widgets/utilFormData'
import BlueprintSelectorWidget from '../form-rjsf-widgets/BlueprintSelectorWidget'
import DestinationSelectorWidget from '../form-rjsf-widgets/DestinationSelectorWidget'

interface Props {
  document: Blueprint | {}
  blueprints: Blueprint[]
  blueprint: Blueprint
  template: any
  onSubmit: (data: any) => void
}

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

  //support AttributeWidget
  appendAttributes(blueprint, blueprints, uiSchema)

  const formData = castValues(blueprint, data)
  return (
    <Form
      formData={formData}
      schema={schema}
      uiSchema={uiSchema}
      fields={{
        attribute: AttributeWidget,
        collapsible: CollapsibleField,
        type: BlueprintSelectorWidget,
        destination: DestinationSelectorWidget,
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

export function findUiAttribute(uiRecipe: any, name: string): any {
  if (uiRecipe) {
    return uiRecipe.attributes.find(
      (uiAttribute: any) => uiAttribute.name === name
    )
  }
  return {}
}

export function findRecipe(blueprint: Blueprint, uiRecipePlugin: string): any {
  if (blueprint.uiRecipes) {
    return blueprint.uiRecipes.find(
      (recipe: any) => recipe.plugin === uiRecipePlugin
    )
  }
  return {}
}
