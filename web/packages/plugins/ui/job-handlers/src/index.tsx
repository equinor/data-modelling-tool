import { DmtPluginType } from '@dmt/common'
import { EditContainer } from './EditContainer'

export const plugins: any = [
  {
    pluginName: 'edit-container-job',
    pluginType: DmtPluginType.UI,
    component: EditContainer,
  },
]
