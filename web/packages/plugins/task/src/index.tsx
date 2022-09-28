import { TDmtPlugin, EDmtPluginType } from '@development-framework/dm-core'
import { EditTask } from './EditTask'
import { ViewTask } from './ViewTask'
import { EditInput } from './InputOnly'

export const plugins: TDmtPlugin[] = [
  {
    pluginName: 'edit-task',
    pluginType: EDmtPluginType.UI,
    component: EditTask,
  },
  {
    pluginName: 'view-task',
    pluginType: EDmtPluginType.UI,
    component: ViewTask,
  },
  {
    pluginName: 'edit-task-operator',
    pluginType: EDmtPluginType.UI,
    component: EditInput,
  },
]
