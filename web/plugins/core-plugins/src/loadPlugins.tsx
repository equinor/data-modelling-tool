import { DmtPlugin, DmtPluginType } from './types'
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
    plugin.then((loadedPlugin: DmtPlugin) => {
      const { pluginName, pluginType, PluginComponent } = loadedPlugin
      console.log(`Added plugin: ${pluginName}`)
      switch (pluginType) {
        case DmtPluginType.UI:
          uiPlugins[pluginName] = PluginComponent
          break
      }
    })
  })
}

export default loadPlugins
