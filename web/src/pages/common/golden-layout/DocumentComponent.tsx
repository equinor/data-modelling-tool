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
import pluginHook from '../../../external-plugins'
import { EditPlugin, ViewPlugin } from '../../../plugins/'

const Wrapper = styled.div`
  padding: 20px;
`

//@todo add UiPlugin
export enum RegisteredPlugins {
  PREVIEW = 'PREVIEW',
  EDIT = 'EDIT',
  VIEW = 'VIEW',
  EDIT_PLUGIN = 'EDIT_PLUGIN',
}

// These UI recipes should always be shown
const DEFAULT_UI_RECIPES = [RegisteredPlugins.PREVIEW, RegisteredPlugins.EDIT]

const View = (props: any) => {
  const {
    schemaUrl,
    parent,
    children,
    document,
    dataUrl,
    attribute,
    uiRecipe,
  } = props

  const pluginProps = {
    parent,
    blueprint: document,
    children,
    name: uiRecipe,
  }

  switch (uiRecipe) {
    case 'PREVIEW':
      return <BlueprintPreview data={document} />

    case RegisteredPlugins.VIEW:
      return <ViewPlugin {...pluginProps} />

    case RegisteredPlugins.EDIT_PLUGIN:
      return (
        <EditPlugin
          {...pluginProps}
          onSubmit={onFormSubmit({ attribute: null, dataUrl })}
        />
      )

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
  const { document, parent } = props
  const { uiRecipes = [] } = document

  //@todo remove this, now name and plugin in a uiRecipe must match, otherwise the plugin wont be used.
  const uiRecipeNamesBlueprint = uiRecipes.map(
    (uiRecipe: any) => uiRecipe['name']
  )
  const uiRecipeNamesParent = parent.uiRecipes
    .map((uiRecipe: any) => uiRecipe['plugin'])
    .filter((name: string) => name !== undefined)
  // Create a list of unique UI recipe names
  const uiRecipesNames = Array.from(
    new Set(
      DEFAULT_UI_RECIPES.concat(uiRecipeNamesBlueprint).concat(
        uiRecipeNamesParent
      )
    )
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
  const { dataUrl, attribute = null } = props
  return (
    <Wrapper>
      <FetchDocument
        url={dataUrl}
        render={(data: any) => {
          const document = attribute
            ? objectPath.get(data.document, attribute, {})
            : data.document

          return (
            <ViewList
              {...props}
              document={document}
              children={data.children}
              parent={data.blueprint}
            />
          )
        }}
      />
    </Wrapper>
  )
}

export default DocumentComponent
