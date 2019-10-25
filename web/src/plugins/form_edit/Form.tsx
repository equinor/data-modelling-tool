import React from 'react'
import Form from 'react-jsonschema-form'
import { Blueprint, BlueprintAttribute, PluginProps } from '../types'
import { createFormConfigs, FormConfig } from './util/CreateConfig'
import { findRecipe, findUiAttribute, isPrimitive } from '../pluginUtils'
import { AttributeWidget } from '../../components/widgets/Attribute'

interface Props extends PluginProps {
  onSubmit: (data: any) => void
}

export const EditPlugin = (props: Props) => {
  const uiRecipe = findRecipe(props.parent, props.name)
  const splitForms = getSplitForms(props.parent, props.blueprint, uiRecipe)
  const configs: FormConfig[] = createFormConfigs(props, splitForms, uiRecipe)
  return (
    <div>
      {configs.map((config: any, index: number) => {
        const showLabel: boolean = getShowLabel(config.attribute)
        return (
          <div key={'form' + index} style={{ marginBottom: 20 }}>
            {showLabel && (
              <div style={{ fontSize: 'bold' }}>{config.attribute.name}</div>
            )}
            <Form
              schema={config.template}
              formData={config.data || {}}
              uiSchema={config.uiSchema || {}}
              fields={{
                attribute: AttributeWidget,
                hidden: () => <div />,
              }}
              onSubmit={props.onSubmit}
            />
          </div>
        )
      })}
    </div>
  )
}

function getShowLabel(attribute: BlueprintAttribute): boolean {
  if (!attribute) {
    return false
  }
  return attribute.dimensions !== '*' && !isPrimitive(attribute.type)
}

/**
 * Check if splitForm is needed.
 * Default behavior:  if two or more attributes is array, its convenient to split the forms.
 * @todo use treeUiRecipe to decide if splitForm is necessary.
 *
 * @param parent Blueprint
 */
function getSplitForms(
  parent: Blueprint,
  blueprint: Blueprint,
  uiRecipe: any
): boolean {
  function filterArrayAttributes(parentAttribute: BlueprintAttribute) {
    const uiAttribute: any = findUiAttribute(uiRecipe, parentAttribute.name)
    if (uiAttribute && uiAttribute.contained === false) {
      return false
    }
    const value = (parent as any)[parentAttribute.name]
    return parentAttribute.dimensions === '*' && value && value.length > 0
  }
  const attributesWithArray = parent.attributes.filter(filterArrayAttributes)
  return attributesWithArray.length > 1
}
