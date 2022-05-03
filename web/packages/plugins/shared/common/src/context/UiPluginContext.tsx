import React, { createContext, useEffect, useState } from 'react'

export interface DmtPlugin {
  pluginType: DmtPluginType
  pluginName: string
  content: any
}

export type UiPluginMap = {
  [key: string]: DmtPlugin
}

export interface LoadedPlugin {
  plugins: DmtPlugin[]
}

export interface DmtUIPlugin {
  type?: string
  categories?: string[]
  dataSourceId: string
  documentId: string
  onSubmit?: Function
  onChange?: Function
  onOpen?: Function
  document?: any
  updateDocument?: any
  config?: any
}

export enum DmtPluginType {
  UI,
  PAGE,
}

export interface DmtSettings {
  name: string
  label: string
  tabIndex: number
  hidden: boolean
  visibleDataSources: any
  type: string
  description: string
  packages: any
  models: any
  actions: any
  file_loc: string
  data_source_aliases: any
  urlPath: string
}

export const UiPluginContext = createContext({})

export const UiPluginProvider = ({ pluginsToLoad, children }: any) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [plugins, setPlugins] = useState<UiPluginMap>({})

  // Async load all the javascript packages defined in packages.json
  // Iterate every package, and adding all the UiPlugins contained in each package to the context
  useEffect(() => {
    let newPluginMap: UiPluginMap
    Promise.all(
      pluginsToLoad.map(
        async (pluginPackage: any) =>
          await pluginPackage.then((loadedPluginPackage: LoadedPlugin) =>
            loadedPluginPackage.plugins.map((plugin: DmtPlugin) => plugin)
          )
      )
    )
      .then((pluginPackageList: any[]) => {
        pluginPackageList.forEach((pluginPackage: DmtPlugin[]) => {
          pluginPackage.forEach(
            (plugin) =>
              (newPluginMap = {
                ...newPluginMap,
                [plugin.pluginName]: plugin.content.component,
              })
          )
        })
        setPlugins(newPluginMap)
      })
      .catch((e: any) => {
        console.error(e)
        return []
      })
      .finally(() => setLoading(false))
  }, [pluginsToLoad])

  function getUiPlugin(uiRecipeName: string) {
    const pluginName = uiRecipeName.trim()
    if (pluginName in plugins) return plugins[pluginName]
    return () => <div>Did not find the plugin: {pluginName} </div>
  }

  function getPagePlugin(uiRecipeName: string) {
    const pluginName = uiRecipeName.trim()
    if (pluginName in plugins) {
      return plugins[pluginName]
    }
    console.warn(
      `No pagePlugin loaded for application '${pluginName}'. Defaulting to the DMT view`
    )
    return plugins['DMT']
  }

  return (
    <UiPluginContext.Provider
      value={{ plugins, loading, getUiPlugin, getPagePlugin }}
    >
      {children}
    </UiPluginContext.Provider>
  )
}
