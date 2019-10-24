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
import { EditPlugin } from '../../../plugins/form_edit/Form'
import ViewPlugin from '../../../plugins/view/ViewPlugin'

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

const View = (props: any) => {
  const {
    schemaUrl,
    parent,
    children,
    document,
    dataUrl,
    attribute,
    uiPlugin,
  } = props
  const pluginProps = {
    parent,
    blueprint: document,
    children,
    name: uiPlugin,
  }
  const documentOrAttributes = attribute
    ? objectPath.get(document, attribute, {})
    : document
  switch (uiPlugin) {
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
    case RegisteredPlugins.EDIT:
      return (
        <ReactJsonSchemaWrapper
          document={documentOrAttributes}
          schemaUrl={schemaUrl}
          dataUrl={dataUrl}
          attribute={attribute}
          uiRecipe={uiPlugin}
        />
      )

    default:
      const ExternalPlugin = pluginHook(uiPlugin)
      if (ExternalPlugin) {
        return <ExternalPlugin {...pluginProps} />
      }

      return <div>`Plugin not supported: ${uiPlugin}`</div>
  }
}

const ViewList = (props: any) => {
  const { parent } = props
  const uiPluginNames = parent.uiRecipes
    .map((uiRecipe: any) => {
      if (!uiRecipe.plugin) {
        console.warn('plugin missing: ' + uiRecipe)
      }
      return uiRecipe.plugin
    })
    .filter((name: string) => name !== undefined)

  //@todo remove this hack when all blueprints has correct defualt uiSchemas set.
  if (uiPluginNames.length === 0) {
    uiPluginNames.push('PREVIEW');
    uiPluginNames.push('EDIT');
  }
  return (
    <Tabs>
      <TabList>
        {uiPluginNames.map((uiPluginName: string) => {
          return <Tab key={uiPluginName}>{uiPluginName}</Tab>
        })}
      </TabList>
      {uiPluginNames.map((uiPluginName: string) => {
        return (
          <TabPanel key={uiPluginName}>
            <View {...props} uiPlugin={uiPluginName} />
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
          return (
            <ViewList
              {...props}
              document={data.document}
              parent={data.blueprint}
              children={data.children}
            />
          )
        }}
      />
    </Wrapper>
  )
}

export default DocumentComponent
