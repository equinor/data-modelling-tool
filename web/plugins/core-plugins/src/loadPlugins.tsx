import { DmtPlugin, DmtPluginType, LoadedPlugin } from './types'
import React from 'react'

export const uiPlugins: any = {}

interface LoadPluginProps {
  plugins: any
}

export const getUIPlugin = (uiRecipeName: string) => {
  const pluginName = uiRecipeName.trim()
  if (pluginName in uiPlugins) return uiPlugins[pluginName]
  return () => <div>Did not find the plugin: {pluginName} </div>
}

export const loadPlugins = (input: LoadPluginProps) => {
  const { plugins } = input
  plugins.forEach((plugin: any) => {
    plugin.then((loadedPlugin: LoadedPlugin) => {
      const { plugins } = loadedPlugin
      plugins.map((plugin: DmtPlugin) => {
        const { pluginName, pluginType, content } = plugin
        switch (pluginType) {
          case DmtPluginType.UI:
            uiPlugins[pluginName] = content['component'] //store plugin's component in the uiPlugins variable
            break
        }
      })
    })
  })
}

export default loadPlugins
