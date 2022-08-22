import { DmtPluginType } from '@data-modelling-tool/core'

import App from './App'

export const plugins: any = [
  {
    pluginName: 'analysisPlatformApp',
    pluginType: DmtPluginType.PAGE,
    component: App,
  },
]

export * from './utils/auth'
export * from './Types'
export * from './const'
export * from './Enums'
