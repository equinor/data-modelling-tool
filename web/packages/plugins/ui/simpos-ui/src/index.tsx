import * as React from 'react'

import { useDocument } from '@dmt/common'
import { DmtPluginType, DmtUIPlugin } from '@dmt/common'

//import { SRSEnvTable } from './simpos/srs/view/env.js'
//import EditDocument from './EditDocument'
//***********************************************************
//SIMPOS General
//***********************************************************
//import { SimposStatusView } from './simpos/views/results.js'

//***********************************************************
//Forms
import { SingleObjectForm } from './simpos/forms/SingleObjectForm'
//***********************************************************
//SRS Forms
//import { SRSEnvForm } from './simpos/srs/forms/SRSEnvForm'
import { SRSSceForm } from './simpos/srs/forms/SRSSceForm'
import { SRSSceSimulationForm } from './simpos/srs/forms/SRSSceSimulationForm'

//LS Forms
import { LSSceForm } from './simpos/ls/forms/LSSceForm'

//RAO Forms
import { RAOSceForm } from './simpos/rao/forms/RAOSceForm'

//SIMA General
import { SimposReportView } from './simpos/views/SimposReportView'
import { SimposRunOutputView } from './simpos/views/SimposRunOutputView'
import { SimposStatusView } from './simpos/views/SimposRunOutputView'

//SIMA Models
import { SIMA_Model_StructuralMass } from './sima/model/views/StructuralMass'
import { SIMA_Model_FirstOrderMotionTransferFunction } from './sima/model/views/FirstOrderMotionTransferFunction'

import { SIMA_Workflow_View } from './sima/workflow/views/Workflow'
import { SIMA_WorkflowTask_View } from './sima/workflow/views/WorkflowTask'
import { SIMA_Model_SIMOBody } from './sima/model/views/SIMOBody_src'
import { SIMA_Model_QuadCurrentCoeffPlot } from './sima/model/views/QuadCurrentCoeffPlot_src'

//***********************************************************
//***********************************************************

export const plugins: any = [
  {
    pluginName: 'simpos-single-object-form',
    pluginType: DmtPluginType.UI,
    component: SingleObjectForm,
  },

  //********************************************************
  //SRS forms
  //********************************************************
  // {
  //     pluginName: 'simpos-srs-env-table',
  //     pluginType: DmtPluginType.UI,
  //     content: {
  //         component: SRSEnvTable_Component,
  //     },
  // },
  {
    pluginName: 'simpos-srs-sce-form',
    pluginType: DmtPluginType.UI,
    component: SRSSceForm,
  },
  {
    pluginName: 'simpos-srs-sce-simulation-form',
    pluginType: DmtPluginType.UI,
    component: SRSSceSimulationForm,
  },
  //********************************************************
  //LS forms
  //********************************************************
  {
    pluginName: 'simpos-ls-sce-form',
    pluginType: DmtPluginType.UI,
    component: LSSceForm,
  },
  //********************************************************
  //RAO forms
  //********************************************************
  {
    pluginName: 'simpos-rao-sce-form',
    pluginType: DmtPluginType.UI,
    component: RAOSceForm,
  },
  //********************************************************
  //SIMA General
  //********************************************************
  {
    pluginName: 'simpos-report-view',
    pluginType: DmtPluginType.UI,
    component: SimposReportView,
  },
  {
    pluginName: 'simpos-run-output-view',
    pluginType: DmtPluginType.UI,
    component: SimposRunOutputView,
  },
  {
    pluginName: 'simpos-run-status-view',
    pluginType: DmtPluginType.UI,
    component: SimposStatusView,
  },

  //********************************************************
  //SIMA Model
  //********************************************************
  {
    pluginName: 'sima-model-view-quad-current-coeff',
    pluginType: DmtPluginType.UI,
    component: SIMA_Model_QuadCurrentCoeffPlot,
  },
  {
    pluginName: 'sima-model-view-simo-structural-mass',
    pluginType: DmtPluginType.UI,
    component: SIMA_Model_StructuralMass,
  },
  {
    pluginName: 'sima-model-view-FirstOrderMotionTransferFunction',
    pluginType: DmtPluginType.UI,
    component: SIMA_Model_FirstOrderMotionTransferFunction,
  },
  {
    pluginName: 'sima-model-view-simo-body',
    pluginType: DmtPluginType.UI,
    component: SIMA_Model_SIMOBody,
  },
  {
    pluginName: 'sima-workflow-view',
    pluginType: DmtPluginType.UI,
    component: SIMA_Workflow_View,
  },
  {
    pluginName: 'sima-workflow-task-view',
    pluginType: DmtPluginType.UI,
    component: SIMA_WorkflowTask_View,
  },
  //********************************************************
  //********************************************************
]