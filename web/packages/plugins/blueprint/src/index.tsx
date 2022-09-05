import { EDmtPluginType } from '@dmt/common'
import { EditBlueprint } from './EditBlueprint'

export const plugins: any = [
  {
    pluginName: 'edit-blueprint',
    pluginType: EDmtPluginType.UI,
    component: EditBlueprint,
  },
]
