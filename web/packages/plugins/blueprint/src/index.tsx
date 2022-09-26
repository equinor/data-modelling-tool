import { EDmtPluginType } from '@development-framework/dm-core'
import { EditBlueprint } from './EditBlueprint'

export const plugins: any = [
  {
    pluginName: 'edit-blueprint',
    pluginType: EDmtPluginType.UI,
    component: EditBlueprint,
  },
]
