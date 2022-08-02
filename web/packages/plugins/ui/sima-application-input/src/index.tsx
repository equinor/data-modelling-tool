import { DmtPluginType } from '@dmt/common'
import { EditSimaApplicationInput } from './EditSimaApplicationInput'
import { UpdateInputOnly } from './UpdateInputOnly'

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
]
