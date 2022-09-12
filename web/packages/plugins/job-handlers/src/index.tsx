import { EDmtPluginType } from '@data-modelling-tool/core'
import { EditContainer } from './EditContainer'

export const plugins: any = [
  {
    pluginName: 'edit-container-job',
    pluginType: EDmtPluginType.UI,
    component: EditContainer,
  },
]
