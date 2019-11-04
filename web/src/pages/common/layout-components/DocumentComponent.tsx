import React from 'react'
import ReactJsonSchemaWrapper, {
  onFormSubmit,
} from '../form/ReactJsonSchemaWrapper'
import styled from 'styled-components'
import FetchDocument from '../utils/FetchDocument'
// @ts-ignore
import objectPath from 'object-path'
import Tabs, { Tab, TabList, TabPanel } from '../../../components/Tabs'
import BlueprintPreview from '../../../plugins/preview/PreviewPlugin'
import pluginHook from '../../../external-plugins/index'
import { EditPlugin, ViewPlugin, PlotPlugin } from '../../../plugins'
import { LayoutContext } from '../golden-layout/LayoutContext'

const Wrapper = styled.div`
  padding: 20px;
`

//@todo add UiPlugin
export enum RegisteredPlugins {
  PREVIEW = 'PREVIEW',
  EDIT = 'EDIT',
  VIEW = 'VIEW',
  EDIT_PLUGIN = 'EDIT_PLUGIN',
  PLOT = 'PLOT',
}

// These UI recipes should always be shown
const DEFAULT_UI_RECIPES = [
  RegisteredPlugins.PREVIEW,
  RegisteredPlugins.EDIT,
  RegisteredPlugins.EDIT_PLUGIN,
]

const View = (props: any) => {
  const {
    schemaUrl,
    blueprint,
    blueprints,
    document,
    dataUrl,
    attribute,
    uiRecipe,
  } = props

  const pluginProps = {
    blueprint,
    document,
    blueprints,
    name: uiRecipe,
  }

  switch (uiRecipe) {
    case 'PREVIEW':
      return <BlueprintPreview data={document} />

    case RegisteredPlugins.VIEW:
      return <ViewPlugin {...pluginProps} />

    case RegisteredPlugins.EDIT_PLUGIN:
      return (
        <LayoutContext.Consumer>
          {(layout: any) => {
            return (
              <EditPlugin
                {...pluginProps}
                onSubmit={onFormSubmit({ attribute: null, dataUrl, layout })}
              />
            )
          }}
        </LayoutContext.Consumer>
      )

    case RegisteredPlugins.PLOT:
      return <PlotPlugin {...pluginProps} />

    default:
      const ExternalPlugin = pluginHook(uiRecipe)
      if (ExternalPlugin) {
        return <ExternalPlugin {...props} />
      }
      // TODO move edit to a case EDIT
      //return <div>`Plugin not supported: ${uiRecipe}`</div>
      return (
        <ReactJsonSchemaWrapper
          document={document}
          schemaUrl={schemaUrl}
          dataUrl={dataUrl}
          attribute={attribute}
          uiRecipe={uiRecipe}
        />
      )
  }
}

const ViewList = (props: any) => {
  const { parent } = props

  const uiRecipeNamesParent = parent.uiRecipes
    .map((uiRecipe: any) => uiRecipe['plugin'])
    .filter((name: string) => name !== undefined)
  // Create a list of unique UI recipe names
  const uiRecipesNames = Array.from(
    new Set(DEFAULT_UI_RECIPES.concat(uiRecipeNamesParent))
  )
  return (
    <Tabs>
      <TabList>
        {uiRecipesNames.map((uiRecipesName: string) => {
          return <Tab key={uiRecipesName}>{uiRecipesName}</Tab>
        })}
      </TabList>
      {uiRecipesNames.map((uiRecipesName: string) => {
        return (
          <TabPanel key={uiRecipesName}>
            <View {...props} uiRecipe={uiRecipesName} />
          </TabPanel>
        )
      })}
    </Tabs>
  )
}

const DocumentComponent = (props: any) => {
  const { dataUrl } = props
  return (
    <Wrapper>
      <FetchDocument
        url={dataUrl}
        render={(data: any) => {
          const document = data.document

          return (
            <ViewList
              {...props}
              document={document}
              blueprints={data.children}
              blueprint={data.blueprint}
            />
          )
        }}
      />
    </Wrapper>
  )
}

export default DocumentComponent
