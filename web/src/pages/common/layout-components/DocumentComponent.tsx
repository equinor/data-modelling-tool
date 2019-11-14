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
import { PluginProps } from '../../../plugins/types'

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

const plugins: Plugin[] = [
  {
    label: 'Preview',
    name: RegisteredPlugins.PREVIEW,
  },
  {
    label: 'Edit',
    name: RegisteredPlugins.EDIT,
    disabled: true,
  },
  {
    label: 'Edit',
    name: RegisteredPlugins.EDIT_PLUGIN,
  },
  {
    label: 'View',
    name: RegisteredPlugins.VIEW,
    disabled: true,
  },
  {
    label: 'Plot',
    name: RegisteredPlugins.PLOT,
    disabled: true,
  },
]

// based on plugin blueprints
type Plugin = {
  label: string
  name: string
  optional?: boolean
  disabled?: boolean
}

const View = (props: any) => {
  const {
    schemaUrl,
    blueprint,
    blueprints,
    document,
    dataUrl,
    attribute,
    plugin,
  } = props

  const pluginProps = {
    blueprint,
    document,
    blueprints,
    name: plugin.name,
  }

  switch (plugin.name) {
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
          uiRecipe={plugin.name}
        />
      )

    case RegisteredPlugins.PLOT:
      return <PlotPlugin {...pluginProps} />

    default:
      const ExternalPlugin = pluginHook(plugin.name)
      if (ExternalPlugin) {
        return <ExternalPlugin {...props} />
      }
      console.warn(`Plugin not supported: ${plugin.name}`)
      return <div>{`Plugin not supported: ${plugin.name}`}</div>
  }
}

const ViewList = (props: PluginProps) => {
  const visiblePlugins = plugins.filter(
    (plugin: Plugin) => plugin.disabled !== true
  )
  return (
    <Tabs>
      <TabList>
        {visiblePlugins.map((plugin: Plugin) => {
          return (
            <Tab key={plugin.name} id={plugin.name}>
              {plugin.label}
            </Tab>
          )
        })}
      </TabList>
      {visiblePlugins.map((plugin: Plugin) => {
        return (
          <TabPanel key={plugin.name}>
            <View {...props} plugin={plugin} />
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
