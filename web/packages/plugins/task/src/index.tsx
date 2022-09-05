import { TDmtPlugin, DmtPluginType } from '@data-modelling-tool/core'
import { EditTask } from './EditTask'
import { ViewTask } from './ViewTask'
import { EditInput } from './InputOnly'

export const plugins: TDmtPlugin[] = [
  {
    pluginName: 'edit-task',
    pluginType: DmtPluginType.UI,
    component: EditTask,
  },
  {
    pluginName: 'view-task',
    pluginType: DmtPluginType.UI,
    component: ViewTask,
  },
  {
    pluginName: 'edit-task-operator',
    pluginType: DmtPluginType.UI,
    component: EditInput,
  },
]
