import React, { createContext, useEffect, useState } from 'react'

export interface DmtPlugin {
  pluginType: DmtPluginType
  pluginName: string
  component: (props: DmtUIPlugin) => JSX.Element
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
  onOpen?: Function
  config?: any
}

export enum DmtPluginType {
  UI,
  PAGE,
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
              (newPluginMap = { ...newPluginMap, [plugin.pluginName]: plugin })
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

  function getUiPlugin(uiRecipeName: string): DmtPlugin {
    const pluginName = uiRecipeName.trim()
    if (pluginName in plugins) return plugins[pluginName]
    return {
      pluginName: 'NotFound',
      pluginType: DmtPluginType.UI,
      component: () => <div>Did not find the plugin: {pluginName} </div>,
    }
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
