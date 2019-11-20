import React from 'react'
import ReactJsonSchemaWrapper, {
  onFormSubmit,
} from '../form/ReactJsonSchemaWrapper'
import styled from 'styled-components'
import FetchDocument from '../utils/FetchDocument'
import Tabs, { Tab, TabList, TabPanel } from '../../../components/Tabs'
import BlueprintPreview from '../../../plugins/preview/PreviewPlugin'
import pluginHook from '../../../external-plugins/index'
import { EditPlugin, ViewPlugin } from '../../../plugins'
import { LayoutContext } from '../golden-layout/LayoutContext'
import { PluginProps, UiRecipe } from '../../../plugins/types'
import { GenerateUiRecipeTabs } from './GenerateUiRecipeTabs'

const Wrapper = styled.div`
  padding: 20px;
`

export enum RegisteredPlugins {
  PREVIEW = 'PREVIEW',
  EDIT_PLUGIN = 'EDIT_PLUGIN',
  EDIT = 'EDIT',
  VIEW = 'VIEW',
  EXTERNAL = 'EXTERNAL',
}

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

  const pluginProps: PluginProps = {
    blueprint,
    document,
    blueprints,
    uiRecipe,
    dtos: [],
  }

  switch (uiRecipe.plugin) {
    case RegisteredPlugins.PREVIEW:
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
    case RegisteredPlugins.EDIT:
      return (
        <ReactJsonSchemaWrapper
          blueprint={blueprint}
          blueprints={blueprints}
          document={document}
          schemaUrl={schemaUrl}
          dataUrl={dataUrl}
          attribute={attribute}
          uiRecipe={uiRecipe.name}
        />
      )
    case RegisteredPlugins.EXTERNAL:
      const ExternalPlugin = pluginHook(uiRecipe)
      if (ExternalPlugin) {
        return <ExternalPlugin {...props} />
      }
      break
  }
  console.warn(`Plugin not supported: ${uiRecipe.plugin}`)
  return <div>{`Plugin not supported: ${uiRecipe.plugin}`}</div>
}

const ViewList = (props: PluginProps) => {
  const generateUiRecipeTabs = new GenerateUiRecipeTabs(
    props.blueprint.uiRecipes
  )
  const uiRecipeTabs: UiRecipe[] = generateUiRecipeTabs.getTabs()
  return (
    <Tabs>
      <TabList>
        {uiRecipeTabs.map((uiRecipe: UiRecipe) => {
          return (
            <Tab key={uiRecipe.name + uiRecipe.plugin} id={uiRecipe.plugin}>
              {uiRecipe.name}
            </Tab>
          )
        })}
      </TabList>
      {uiRecipeTabs.map((uiRecipe: UiRecipe) => {
        return (
          <TabPanel key={uiRecipe.name + uiRecipe.plugin}>
            <View {...props} uiRecipe={uiRecipe} />
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
              dtos={data.dtos || []}
            />
          )
        }}
      />
    </Wrapper>
  )
}

export default DocumentComponent
