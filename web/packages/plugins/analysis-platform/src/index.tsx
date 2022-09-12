import { DmtPluginType } from '@data-modelling-tool/core'

import App from './App'
import { InspectorView, OperatorView } from './modules/Analysis'
import { AssetView } from './modules/Asset/AssetView'

export const plugins: any = [
  {
    pluginName: 'analysisPlatformApp',
    pluginType: DmtPluginType.PAGE,
    component: App,
  },
  {
    pluginName: 'view-analysis-inspector',
    pluginType: DmtPluginType.UI,
    component: InspectorView,
  },
  {
    pluginName: 'view-analysis-operator',
    pluginType: DmtPluginType.UI,
    component: OperatorView,
  },
  {
    pluginName: 'view-asset',
    pluginType: DmtPluginType.UI,
    component: AssetView,
  },
]

export * from './utils/auth'
export * from './Types'
export * from './const'
export * from './Enums'
