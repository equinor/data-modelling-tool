import { DmtPlugin, DmtPluginType } from '@data-modelling-tool/core'
import { OperatorView } from './OperatorView'
import { InspectorView } from './InspectorView'

export const plugins: DmtPlugin[] = [
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
]
