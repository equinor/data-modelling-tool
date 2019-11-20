import React from 'react'
import { BlueprintAttribute, PluginProps, UiRecipe } from '../types'
import ErrorBoundary from '../../components/ErrorBoundary'
import TableWidget from '../widgets/table/TableWidget'
import { Pre } from '../preview/PreviewPlugin'

// available on attribute level of this.
enum ViewWidgets {
  VIEW_WIDGET = 'view.widget',
  TABLE_WIDGET = 'table.widget',
}

export const ViewPlugin = ({ blueprint, document, uiRecipe }: PluginProps) => {
  const widgets = blueprint.attributes.map(
    (parentAttribute: BlueprintAttribute, index: number) => {
      const plugin = uiRecipe.plugin
      const attribute = (document as any)[parentAttribute.name]
      const key = `${plugin}-${index}`
      switch (plugin) {
        case ViewWidgets.VIEW_WIDGET:
          return <DefaultView key={key} attribute={parentAttribute} />
        case ViewWidgets.TABLE_WIDGET:
          return (
            <ErrorBoundary key={key}>
              <TableWidget
                blueprint={document}
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
        <span style={{ paddingRight: 20 }}>{document.name}</span>
        <span>{document.type}</span>
      </div>
      <div style={{ padding: 20 }}>{widgets}</div>
    </div>
  )
}

type DefaultViewProps = {
  attribute: BlueprintAttribute
}

const PreviewView = ({ attribute }: DefaultViewProps) => {
  return <Pre>{JSON.stringify(attribute, null, 2)}</Pre>
}

export const DefaultView = ({ attribute }: DefaultViewProps) => {
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
