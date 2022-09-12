import * as React from 'react'

import { useDocument } from '@data-modelling-tool/core'
import { DmtPluginType, DmtUIPlugin } from '@data-modelling-tool/core'

import { DMTBluePrintTableView } from './dmt/views/DMTBluePrintTableView'

import { SIMOSRawView } from './simos/views/SIMOSRawView'

export const plugins: any = [
  //********************************************************
  //DMT forms
  //********************************************************
  {
    pluginName: 'dmt-blueprint-table-view',
    pluginType: DmtPluginType.UI,
    component: DMTBluePrintTableView,
  },
  //********************************************************
  //simos forms
  //********************************************************
  {
    pluginName: 'simos-raw-view',
    pluginType: DmtPluginType.UI,
    component: SIMOSRawView,
  },
  //********************************************************
  //********************************************************
]
