import React, { useState } from 'react'
import Form from 'react-jsonschema-form'
import { AttributeWidget } from '../form-rjsf-widgets/Attribute'
import { CollapsibleField } from '../widgets/CollapsibleField'
import { BlueprintType } from '../../domain/types'
import { castValues } from '../form-rjsf-widgets/utilFormData'
import BlueprintSelectorWidget from '../form-rjsf-widgets/BlueprintSelectorWidget'
import DestinationSelectorWidget from '../form-rjsf-widgets/DestinationSelectorWidget'
import EntitySelectorWidget from '../form-rjsf-widgets/EntitySelectorWidget'

interface Props {
  document: BlueprintType | {}
  blueprints: BlueprintType[]
  blueprintType: BlueprintType
  template: any
  onSubmit: (data: any) => void
}

export default ({
  document,
  template,
  onSubmit,
  blueprintType,
  blueprints,
}: Props) => {
  const [data, setData] = useState(document)
  const schema = template.schema
  const uiSchema = template.uiSchema

  //support AttributeWidget
  appendAttributes(blueprintType, blueprints, uiSchema)

  const formData = castValues(blueprintType, data)
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
        reference: EntitySelectorWidget,
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
          (blueprintType: BlueprintType) =>
            blueprintType.name === 'BlueprintAttribute'
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
  // TODO: This is a hack. Needed because API form-to-schema does not work properly. And the EditPlugin stuff is not mature enough
  if (uiSchema && uiSchema.reference) {
    uiSchema.reference = { 'ui:field': 'reference' }
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

export function findRecipe(
  blueprintType: BlueprintType,
  uiRecipePlugin: string
): any {
  if (blueprintType.uiRecipes) {
    return blueprintType.uiRecipes.find(
      (recipe: any) => recipe.plugin === uiRecipePlugin
    )
  }
  return {}
}
