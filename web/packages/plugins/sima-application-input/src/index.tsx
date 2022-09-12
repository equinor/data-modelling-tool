import { DmtPluginType } from '@data-modelling-tool/core'
import { EditSimaApplicationInput } from './EditSimaApplicationInput'
import { UpdateInputOnly } from './UpdateInputOnly'
import { ViewSimaApplicationInput } from './ViewSimaApplicationInput'

export const plugins: any = [
  {
    pluginName: 'edit-sima-application-input',
    pluginType: DmtPluginType.UI,
    component: EditSimaApplicationInput,
  },
  {
    pluginName: 'edit-sima-application-input-input',
    pluginType: DmtPluginType.UI,
    component: UpdateInputOnly,
  },
  {
    pluginName: 'view-sima-application-input',
    pluginType: DmtPluginType.UI,
    component: ViewSimaApplicationInput,
  },
]
