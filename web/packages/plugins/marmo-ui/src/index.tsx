import * as React from 'react'

import { useDocument } from '@dmt/common'
import { DmtPluginType, IDmtUIPlugin } from '@dmt/common'

//***********************************************************
//Forms
import { SingleObjectForm } from './marmo/forms/SingleObjectForm'
//***********************************************************

//***********************************************************
//views
import { SignalPlot } from './marmo/containers/views/SignalPlot'
import { SignalTable } from './marmo/containers/views/SignalTable'

import { SignalESSForm } from './marmo/containers/forms/SignalESS'

//***********************************************************
//***********************************************************

export const plugins: any = [
  //********************************************************
  //********************************************************

  {
    pluginName: 'marmo-ess-plot-view',
    pluginType: DmtPluginType.UI,
    component: SignalPlot,
  },

  {
    pluginName: 'marmo-ess-table-view',
    pluginType: DmtPluginType.UI,
    component: SignalTable,
  },

  {
    pluginName: 'marmo-ess-edit-form',
    pluginType: DmtPluginType.UI,
    component: SignalESSForm,
  },
  //********************************************************
  //********************************************************

  {
    pluginName: 'marmo-edit-ess',
    pluginType: DmtPluginType.UI,
    component: SingleObjectForm,
  },
  //********************************************************
  //********************************************************
]
