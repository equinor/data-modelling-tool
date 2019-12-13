import React from 'react'
import {
  Blueprint as BlueprintType,
  BlueprintAttribute,
  Dto,
  Entity,
  PluginProps,
} from '../types'
import { Pre } from '../preview/PreviewPlugin'
import { Blueprint, KeyValue } from '../Blueprint'
import { BlueprintProvider } from '../BlueprintProvider'
import { RegisteredPlugins } from '../../pages/common/layout-components/DocumentComponent'
import { ReactTablePlugin } from '../react_table/ReactTablePlugin'
import { PlotPlugin } from '..'
import { CollapsibleWrapper } from '../../components/Collapsible'

enum WIDGETS {
  PREVIEW = 'PREVIEW',
}

class GenerateView {
  private uiRecipe: KeyValue
  private blueprintProvider: any
  private blueprintType: BlueprintType
  private blueprint: Blueprint
  private blueprints: BlueprintType[]
  private document: Entity
  private views: any[] = []
  private dtos: Dto[] = []

  constructor(props: PluginProps) {
    this.uiRecipe = props.uiRecipe
    this.document = props.document
    this.blueprintType = props.blueprint
    this.blueprints = props.blueprints
    this.dtos = props.dtos
    this.blueprintProvider = new BlueprintProvider(this.blueprints, this.dtos)
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
        return <PreviewView key={`widget-${index}`} data={data} />
    }
  }

  createComponentWithRecipe(
    uiAttr: KeyValue,
    attr: BlueprintAttribute,
    index: number
  ): any {
    const attributeType = this.blueprintProvider.getBlueprintByType(attr.type)
    if (attributeType) {
      const attrUiRecipe = attributeType.uiRecipes.find(
        (uiRecipe: KeyValue) => uiRecipe.name === uiAttr.uiRecipe
      )
      if (attrUiRecipe) {
        const attrPluginProps: PluginProps = {
          document: this.document[uiAttr.name],
          blueprint: attributeType,
          blueprints: this.blueprints,
          dtos: this.dtos,
          uiRecipe: attrUiRecipe,
        }
        switch (attrUiRecipe.plugin) {
          case RegisteredPlugins.TABLE:
            return (
              <CollapsibleWrapper
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

const PreviewView = ({ data }: any) => {
  return <Pre>{JSON.stringify(data, null, 2)}</Pre>
}

export const ViewPlugin = (props: PluginProps) => {
  const generateView = new GenerateView(props)
  const viewComponents = generateView.getViews()
  return <div>{viewComponents}</div>
}
