import { EDmtPluginType } from '@development-framework/dm-core'
import { EditSimaApplicationInput } from './EditSimaApplicationInput'
import { UpdateInputOnly } from './UpdateInputOnly'
import { ViewSimaApplicationInput } from './ViewSimaApplicationInput'

export const plugins: any = [
  {
    pluginName: 'edit-sima-application-input',
    pluginType: EDmtPluginType.UI,
    component: EditSimaApplicationInput,
  },
  {
    pluginName: 'edit-sima-application-input-input',
    pluginType: EDmtPluginType.UI,
    component: UpdateInputOnly,
  },
  {
    pluginName: 'view-sima-application-input',
    pluginType: EDmtPluginType.UI,
    component: ViewSimaApplicationInput,
  },
]
