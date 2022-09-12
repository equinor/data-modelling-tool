---
title: Plugin development
sidebar_position: 1
---

## Adding plugins

Add the custom plugins under the `/plugins` folder like shown here.

```
web/
|_ plugins/
  |_ a-custom-plugin/
    |_ package.json
    |_ src/
      |_ index.tsx
|_ plugins.js
```

Add the plugin (package name), e.g a plugin called custom-plugin, into the plugins.js file like this.

```jsx
export default [
    // These are included by default
    import('@dmt/default-pdf'),
    import('@dmt/default-preview'),
    // The extra plugin to be loaded
    import('custom-plugin')
  ]
```

Then, build the docker container again, so that the plugin will be installed.

## Creating a new plugins

You may be looking to build a plugin that doesn’t exist yet, or you may just be curious to know more about the anatomy of a custom plugin (file structure, etc).

A package.json is required.

```json
{
  "name": "@dmt/custom-plugin",
  "version": "1.0.0",
  "main": "src/index.tsx",
  "dependencies": {
    "@data-modelling-tool/core": "x.x.x"
  }
}
```

### Creating a UI plugin

This is the template for a UI plugin.

```jsx
import * as React from 'react'
import { DmtPluginType, IDmtUIPlugin } from '@data-modelling-tool/core'

export const pluginName = 'custom-plugin'
export const pluginType = DmtPluginType.UI

export const PluginComponent = (props: IDmtUIPlugin) => {
  return (
    <div>
      Plugin content goes here!
    </div>
  )
}
```

Everything returned from the PluginComponent will be rendered.

The UI plugin recipes will use the pluginName in the plugin field, which means that this UI recipe will use that plugin, like this.

```json
{
  "uiRecipes": [
    {
      "name": "A custom view",
      "type": "system/SIMOS/UiRecipe",
      "description": "This shows a custom view",
      "plugin": "custom-plugin",
      "options": [],
      "attributes": []
    }
  ]
}
```