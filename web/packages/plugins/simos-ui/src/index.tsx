import * as React from 'react'

import { useDocument } from '@development-framework/dm-core'
import { EDmtPluginType } from '@development-framework/dm-core'

import { DMTBluePrintTableView } from './dmt/views/DMTBluePrintTableView'

import { SIMOSRawView } from './simos/views/SIMOSRawView'

export const plugins: any = [
  //********************************************************
  //DMT forms
  //********************************************************
  {
    pluginName: 'dmt-blueprint-table-view',
    pluginType: EDmtPluginType.UI,
    component: DMTBluePrintTableView,
  },
  //********************************************************
  //simos forms
  //********************************************************
  {
    pluginName: 'simos-raw-view',
    pluginType: EDmtPluginType.UI,
    component: SIMOSRawView,
  },
  //********************************************************
  //********************************************************
]
