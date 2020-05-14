import React from 'react'
import {
  BlueprintType,
  BlueprintAttributeType,
  Dto,
  Entity,
  PluginProps,
  KeyValue,
} from '../../domain/types'
import { Blueprint } from '../../domain/Blueprint'
import { BlueprintProvider } from '../BlueprintProvider'
import { RegisteredPlugins } from '../../pages/common/layout-components/DocumentComponent'
import { ReactTablePlugin } from '../react_table/ReactTablePlugin'
import { PlotPlugin } from '..'
import { CollapsibleWrapper } from '../../components/Collapsible'
import { BlueprintAttribute } from '../../domain/BlueprintAttribute'
import JsonView from '../../components/JsonView'

enum WIDGETS {
  PREVIEW = 'PREVIEW',
}

class GenerateView {
  private uiRecipe: KeyValue
  private blueprintProvider: any
  private blueprintType: BlueprintType
  private blueprint: Blueprint
  private blueprintTypes: BlueprintType[]
  private document: Entity
  private views: any[] = []
  private dtos: Dto[] = []

  constructor(props: PluginProps) {
    this.uiRecipe = props.uiRecipe
    this.document = props.document
    this.blueprintType = props.blueprintType
    this.blueprintTypes = props.blueprintTypes
    this.dtos = props.dtos
    this.blueprintProvider = new BlueprintProvider(
      this.blueprintTypes,
      this.dtos
    )
    this.blueprint = new Blueprint(this.blueprintType)

    this.uiRecipe.attributes.forEach((key: string, index: number) => {
      const uiAttr: KeyValue = this.uiRecipe.attributes[index]
      if (uiAttr) {
        const attr = this.blueprint.getAttribute(uiAttr.name)
        if (attr) {
          const component = this.createComponentWithRecipe(uiAttr, attr, index)
          if (component) {
            this.views.push(component)
          } else if (uiAttr.widget) {
            const widget = this.createComponentWithWidget(uiAttr, index)
            this.views.push(widget)
          }
        }
      }
    })
  }

  createComponentWithWidget(uiAttr: KeyValue, index: number): any {
    switch (uiAttr.widget) {
      case WIDGETS.PREVIEW:
        const data = { [uiAttr.name]: this.document[uiAttr.name] }
        return <JsonView key={`widget-${index}`} data={data} />
    }
  }

  createComponentWithRecipe(
    uiAttr: KeyValue,
    attrType: BlueprintAttributeType,
    index: number
  ): any {
    const attr = new BlueprintAttribute(attrType)
    const attributeType = this.blueprintProvider.getBlueprintByType(
      attr.getAttributeType()
    )
    if (attributeType) {
      const attrUiRecipe = attributeType.uiRecipes.find(
        (uiRecipe: KeyValue) => uiRecipe.name === uiAttr.uiRecipe
      )
      if (attrUiRecipe) {
        const attrPluginProps: PluginProps = {
          document: this.document[uiAttr.name],
          blueprintType: attributeType,
          blueprintTypes: this.blueprintTypes,
          dtos: this.dtos,
          uiRecipe: attrUiRecipe,
        }
        switch (attrUiRecipe.plugin) {
          case RegisteredPlugins.TABLE:
            return (
              <CollapsibleWrapper
                key={'plugin ' + index}
                useCollapsible={uiAttr.collapsible}
                collapsed={true}
                sectionTitle={'Table: ' + attrPluginProps.document.name}
              >
                <ReactTablePlugin key={'plugin' + index} {...attrPluginProps} />
              </CollapsibleWrapper>
            )

          case RegisteredPlugins.PLOT:
            if (uiAttr.collapsible) {
              return (
                <CollapsibleWrapper
                  key={'plugin ' + index}
                  useCollapsible={uiAttr.collapsible}
                  collapsed={true}
                  sectionTitle={'Plot: ' + attrPluginProps.document.name}
                >
                  <PlotPlugin key={'plugin' + index} {...attrPluginProps} />
                </CollapsibleWrapper>
              )
            } else {
              return <PlotPlugin key={'plugin' + index} {...attrPluginProps} />
            }
        }
      }
    }
    return null
  }

  getViews() {
    return this.views
  }
}

export const ViewPlugin = (props: PluginProps) => {
  const generateView = new GenerateView(props)
  const viewComponents = generateView.getViews()
  return <div>{viewComponents}</div>
}
