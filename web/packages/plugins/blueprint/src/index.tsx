import { EDmtPluginType } from '@data-modelling-tool/core'
import { EditBlueprint } from './EditBlueprint'

export const plugins: any = [
  {
    pluginName: 'edit-blueprint',
    pluginType: EDmtPluginType.UI,
    component: EditBlueprint,
  },
]
