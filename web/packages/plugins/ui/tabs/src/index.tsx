import { DmtPluginType } from '@dmt/common'
import { TabsContainer } from './TabsContainer'

export const plugins = [
  {
    pluginName: 'tabs',
    pluginType: DmtPluginType.UI,
    component: TabsContainer,
  },
]
