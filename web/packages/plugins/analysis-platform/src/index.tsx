import { EDmtPluginType } from '@development-framework/dm-core'

import App from './App'
import { InspectorView, OperatorView } from './modules/Analysis'
import { AssetView } from './modules/Asset/AssetView'

export const plugins: any = [
  {
    pluginName: 'analysisPlatformApp',
    pluginType: EDmtPluginType.PAGE,
    component: App,
  },
  {
    pluginName: 'view-analysis-inspector',
    pluginType: EDmtPluginType.UI,
    component: InspectorView,
  },
  {
    pluginName: 'view-analysis-operator',
    pluginType: EDmtPluginType.UI,
    component: OperatorView,
  },
  {
    pluginName: 'view-asset',
    pluginType: EDmtPluginType.UI,
    component: AssetView,
  },
]

export * from './utils/auth'
export * from './Types'
export * from './const'
export * from './Enums'
