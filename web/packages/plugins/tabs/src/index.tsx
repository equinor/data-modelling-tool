import { EDmtPluginType } from '@dmt/common'
import { TabsContainer } from './TabsContainer'

export const plugins: any = [
  {
    pluginName: 'tabs',
    pluginType: EDmtPluginType.UI,
    component: TabsContainer,
  },
]
