import * as React from 'react'

import { useDocument } from '@data-modelling-tool/core'
import { EDmtPluginType, DmtUIPlugin } from '@data-modelling-tool/core'

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
