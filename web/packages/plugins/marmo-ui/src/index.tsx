import * as React from 'react'

import { useDocument } from '@development-framework/dm-core'
import { EDmtPluginType } from '@development-framework/dm-core'

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
    pluginType: EDmtPluginType.UI,
    component: SignalPlot,
  },

  {
    pluginName: 'marmo-ess-table-view',
    pluginType: EDmtPluginType.UI,
    component: SignalTable,
  },

  {
    pluginName: 'marmo-ess-edit-form',
    pluginType: EDmtPluginType.UI,
    component: SignalESSForm,
  },
  //********************************************************
  //********************************************************

  {
    pluginName: 'marmo-edit-ess',
    pluginType: EDmtPluginType.UI,
    component: SingleObjectForm,
  },
  //********************************************************
  //********************************************************
]
