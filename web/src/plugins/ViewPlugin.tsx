import React from 'react'
import { Blueprint, BlueprintAttribute, PluginImport } from './types'
import TableWidget from './table/TableWidget'
import { Pre } from './preview/PreviewPlugin'
import { RegisteredPlugins } from '../pages/common/golden-layout/DocumentComponent'
import ErrorBoundary from '../components/ErrorBoundary'

// available on attribute level of this.
enum ViewWidgets {
  VIEW_WIDGET = 'view.widget',
  TABLE_ATTRIBUTE = 'table.widget',
}

type Props = {
  parent: Blueprint
  blueprint: Blueprint
}

export default ({ parent, blueprint }: Props) => {
  const pluginInput: PluginImport = {
    name: '',
    description: '',
    type: '',
    blueprint,
    parent: parent,
    children: [],
    inPlace: true,
  }

  const widgets = pluginInput.parent.attributes.map(
    (parentAttribute: BlueprintAttribute, index: number) => {
      const plugin = getPluginOfAttribute(parent.uiRecipes, parentAttribute)
      const attribute = (blueprint as any)[parentAttribute.name]
      const key = `${plugin}-${index}`
      switch (plugin) {
        case ViewWidgets.VIEW_WIDGET:
          return <DefaultView key={key} attribute={parentAttribute} />
        case ViewWidgets.TABLE_ATTRIBUTE:
          return (
            <ErrorBoundary key={key}>
              <TableWidget
                blueprint={blueprint}
                parentAttribute={parentAttribute}
                attribute={attribute}
              />
            </ErrorBoundary>
          )
        default:
          return <PreviewView key={key} attribute={attribute} />
      }
    }
  )
  return (
    <div>
      <div>
        <span style={{ paddingRight: 20 }}>{pluginInput.blueprint.name}</span>
        <span>{pluginInput.blueprint.type}</span>
      </div>
      <div style={{ padding: 20 }}>{widgets}</div>
    </div>
  )
}

/**
 * Each root level attribute in the blueprint, can have a plugin.
 * The plugin is a value on a attribute in the current uiRecipe.
 * @todo support default ui plugin when DocumentComponent is using the parents uiRecipe names only.
 *
 * @param uiRecipes from parent
 * @param parentAttribute from parent
 */
function getPluginOfAttribute(
  uiRecipes: any[],
  parentAttribute: BlueprintAttribute
): string {
  // The uiRecipe for this plugin must be provided.
  const uiRecipe = uiRecipes.find(
    (recipe: any) => recipe.plugin === RegisteredPlugins.VIEW
  )
  //find the ui attribute in parents uiRecipes.
  const uiAttribute =
    uiRecipe &&
    uiRecipe.attributes &&
    uiRecipe.attributes.find(
      (uiAttr: any) => uiAttr.name === parentAttribute.name
    )
  return uiAttribute && uiAttribute.plugin
}

type DefaultViewProps = {
  attribute: BlueprintAttribute
}

const PreviewView = ({ attribute }: DefaultViewProps) => {
  return <Pre>{JSON.stringify(attribute, null, 2)}</Pre>
}

const DefaultView = ({ attribute }: DefaultViewProps) => {
  if (attribute.dimensions === '*') {
    return <PreviewView attribute={attribute} />
  }
  return (
    <div style={{ padding: '5px 0' }}>
      <span style={{ marginRight: 20 }}>{attribute.name}</span>
      <span>{attribute.type}</span>
    </div>
  )
}
