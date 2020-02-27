import React, { useEffect, useState } from 'react'
import ReactJsonSchemaWrapper, {
  onFormSubmit,
} from '../form/ReactJsonSchemaWrapper'
import styled from 'styled-components'
import FetchDocument from '../utils/FetchDocument'
import Tabs, { Tab, TabList, TabPanel } from '../../../components/Tabs'
import BlueprintPreview from '../../../plugins/preview/PreviewPlugin'
import pluginHook from '../../../external-plugins/index'
import { EditPlugin, PlotPlugin, ViewPlugin } from '../../../plugins'
import { LayoutContext } from '../golden-layout/LayoutContext'
import { PluginProps, UiRecipe } from '../../../domain/types'
import { GenerateUiRecipeTabs, getDefaultTabs } from './GenerateUiRecipeTabs'
import { ReactTablePlugin } from '../../../plugins/react_table/ReactTablePlugin'
import Api2 from '../../../api/Api2'
// @ts-ignore
import { Viewer3dPlugin } from '../../../plugins/3dviewer/Viewer3dPlugin'

const Wrapper = styled.div`
  padding: 20px;
`

export enum RegisteredPlugins {
  PREVIEW = 'PREVIEW',
  EDIT_PLUGIN = 'EDIT_PLUGIN',
  EDIT = 'EDIT',
  VIEW = 'VIEW',
  PLOT = 'PLOT',
  EXTERNAL = 'EXTERNAL',
  TABLE = 'TABLE',
  VIEW_3D = 'VIEW_3D',
}

const View = (props: any) => {
  const {
    schemaUrl,
    blueprintType,
    blueprintTypes,
    document,
    dataUrl,
    uiRecipe,
    dtos,
    attribute,
  } = props

  let pluginProps: PluginProps = {
    blueprintType,
    document,
    blueprintTypes,
    uiRecipe,
    dtos,
  }

  const [rootDocument, setRootDocument] = useState(undefined)

  useEffect(() => {
    if (!rootDocument && dataUrl.indexOf('.') > -1) {
      //fetch root
      const url = dataUrl.split('?')[0]
      Api2.fetchDocument({
        dataUrl: url,
        onSuccess: (data: any) => setRootDocument(data.document),
      })
    }
  })

  switch (uiRecipe.plugin) {
    case RegisteredPlugins.PREVIEW:
      return <BlueprintPreview {...pluginProps} />
    case RegisteredPlugins.VIEW_3D:
      return <Viewer3dPlugin {...pluginProps} />
    case RegisteredPlugins.VIEW:
      return <ViewPlugin {...pluginProps} />

    case RegisteredPlugins.EDIT_PLUGIN:
      return (
        <LayoutContext.Consumer>
          {(layout: any) => {
            return (
              <EditPlugin
                {...pluginProps}
                rootDocument={rootDocument}
                onSubmit={onFormSubmit({ attribute: null, dataUrl, layout })}
              />
            )
          }}
        </LayoutContext.Consumer>
      )

    case RegisteredPlugins.EDIT:
      return (
        <ReactJsonSchemaWrapper
          blueprintType={blueprintType}
          blueprints={blueprintTypes}
          document={document}
          schemaUrl={schemaUrl}
          dataUrl={dataUrl}
          attribute={attribute}
          uiRecipe={uiRecipe.name}
        />
      )
    case RegisteredPlugins.PLOT:
      return <PlotPlugin {...pluginProps} />
    case RegisteredPlugins.TABLE:
      return <ReactTablePlugin {...pluginProps} />
    case RegisteredPlugins.EXTERNAL:
      return (
        <LayoutContext.Consumer>
          {(layout: any) => {
            // wrap onFormSubmit to hide the rjsf specific schemas input.
            // first invoke onFormSubmit witch returns a function with param schemas.
            const onFormSubmitWrapper: Function = onFormSubmit({
              attribute: null,
              dataUrl,
              layout,
            })
            // create a new function with param formData instead of schemas.
            const updateEntity = (formData: any) => {
              console.log(formData)
              onFormSubmitWrapper({ formData })
            }
            // pass the wrapper function updateEntity to the plugins.
            const ExternalPlugin = pluginHook(uiRecipe)
            if (ExternalPlugin) {
              return <ExternalPlugin {...props} updateEntity={updateEntity} />
            }
          }}
        </LayoutContext.Consumer>
      )
      break
    default:
      console.warn(`Plugin not supported: ${uiRecipe.plugin}`)
  }
  return <div>{`Plugin not supported: ${uiRecipe.plugin}`}</div>
}

const ViewList = (props: PluginProps) => {
  const generateUiRecipeTabs = new GenerateUiRecipeTabs(
    props.blueprintType.uiRecipes,
    getDefaultTabs(props.blueprintType.uiRecipes)
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
  const { dataUrl, updates } = props

  return (
    <Wrapper>
      <FetchDocument
        updates={updates}
        url={dataUrl}
        render={(data: any) => {
          const document = data.document

          return (
            <ViewList
              {...props}
              document={document}
              blueprintTypes={data.children}
              blueprintType={data.blueprint}
              dtos={data.dtos || []}
            />
          )
        }}
      />
    </Wrapper>
  )
}

export default DocumentComponent
