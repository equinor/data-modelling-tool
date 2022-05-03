/**
 * Work space for attaching plugin to the dmt tool.
 * External dependencies:
 * - option1: should either be provided by the DMT (in package.json)
 * - option2: create a lib folder and add transpiled javascript files. Similar to dist folders in node_modules.
 *
 * External plugins must have a unique name, not conflicting with the DMT official plugin names.
 */

/**
 * Work space for attaching plugin to the dmt tool.
 * External dependencies:
 * - option1: should either be provided by the DMT (in package.json)
 * - option2: create a lib folder and add transpiled javascript files. Similar to dist folders in node_modules.
 *
 * External plugins must have a unique name, not conflicting with the DMT official plugin names.
 */

//import { VictoryTheme, VictoryChart, VictoryLine, VictoryBar } from 'victory'

import React from 'react'
//import ReactDOM from 'react-dom';

import Plot from 'react-plotly.js'

import { Component } from 'react'

import { useState } from 'react'
import useCollapse from 'react-collapsed'

import { FaChevronDown, FaChevronRight } from 'react-icons/fa'

/* ********************************************************* */
//Custom views
import { BlueprintTable } from '../dmt/views/blueprint.js'
import { simos_raw_view } from '../simos/views/raw.js'

import { ESSPlotPlugin } from '../marmo/views/SignalPlot.js'

//General Custom Forms
import { SingleObjectForm } from '../simpos/forms/SingleObject.js'
import { simpos_text_file_view } from '../simpos/views/textFile.js'

//sima
import { SimposReportView } from '../simpos/views/report.js'
import { SimposRunOutputView } from '../simpos/views/results.js'
import { SimposStatusView } from '../simpos/views/results.js'
import { SimposSce3DView } from '../simpos/views/3D.js'

//srs
import { SRSEnvTable } from '../simpos/srs/view/env.js'

//Custom forms (editing)
import { SRSEnvForm } from '../simpos/srs/forms/env.js'
import { SRSSceForm } from '../simpos/srs/forms/sce.js'
import { SRSSceSimulationForm } from '../simpos/srs/forms/sce_simulation.js'

//Custom forms (editing)
import { LSSceForm } from '../simpos/ls/forms/sce.js'

import { RAOSceForm } from '../simpos/rao/forms/raoSce.js'

//testing
import { MaterialTableDemo } from '../simpos/views/matTable.js'

/* ********************************************************* */

/* ********************************************************* */
/* ********************************************************* */

function PlotlyPoc(props) {
  const { updateEntity, document } = props
  return (
    <Plot
      data={[
        {
          x: [1, 2, 3],
          y: [2, 6, 3],
          type: 'scatter',
          mode: 'lines+markers',
          marker: { color: 'red' },
        },
        { type: 'bar', x: [1, 2, 3], y: [2, 5, 3] },
      ]}
      onClick={() => {
        document.description = 'test update'
        updateEntity(document)
      }}
      layout={{ width: 320, height: 240, title: 'A Fancy Plot' }}
    />
  )
}
//********************************************************//
//********************************************************//
//making tables
//********************************************************//

const ESSTablePlugin = ({ parent, document, children }) => {
  console.log(document)
  return JSON.stringify(document)
}

//********************************************************//
//********************************************************//

const TestPlugin = ({ parent, document, children }) => {
  return 'my plugin'
}
//********************************************************//
//********************************************************//

//********************************************************//
//********************************************************//
//Helper functions
const getXLabel = (signal) => {
  var label = ''

  if (signal.xlabel !== undefined) {
    label = signal.xlabel
  } else if (signal.xname !== undefined) {
    label = signal.xname
    if (signal.xunit !== undefined) {
      label += ' [' + signal.xunit + ']'
    }
  } else {
    label = 'time'
    if (signal.xunit !== undefined) {
      label += ' [' + signal.xunit + ']'
    }
  }

  return label
}

const getYLabel = (signal) => {
  var label = ''

  if (signal.label !== undefined) {
    label = signal.label
  } else if (signal.name !== undefined) {
    label = signal.name
    if (signal.unit !== undefined) {
      label += ' [' + signal.unit + ']'
    }
  } else {
    label = 'time'
    if (signal.unit !== undefined) {
      label += ' [' + signal.unit + ']'
    }
  }

  return label
}
//********************************************************//
const SRSResultsView = ({ parent, document, children }) => {
  console.log(document)

  // const data = [
  //   {quarter: 1, earnings: 13000},
  //   {quarter: 2, earnings: 16500},
  //   {quarter: 3, earnings: 14250},
  //   {quarter: 4, earnings: 19000},
  //   {quarter: 5, earnings: -1000}
  // ];

  // return (
  //   <VictoryChart>
  //     <VictoryBar
  //       data={data}
  //       x="quarter"
  //       y="earnings"
  //     />
  //   </VictoryChart>
  // )

  var pdatas = []

  for (var sInd = 0; sInd < document.signals.length; sInd++) {
    let signal = document.signals[sInd]
    let pdata = {}
    pdata['x'] = [0]
    pdata['y'] = [0]

    if (Array.isArray(signal.value)) {
      pdata['y'] = signal.value
      pdata['x'] = []
      for (var i = 0; i < signal.value.length; i++) {
        pdata.x.push(signal.xstart + i * signal.xdelta)
      }

      pdata['xlabel'] = getXLabel(signal)
      pdata['ylabel'] = getYLabel(signal)
    }
    pdatas.push(pdata)
  }
  console.log(pdatas)

  return (
    <div className="container">
      {pdatas.map((item, index) => (
        <div className="container" key={index}>
          <Plot
            data={[
              {
                x: item.x,
                y: item.y,
                type: 'scatter',
                mode: 'lines+points',
                marker: { color: 'red' },
              },
            ]}
            layout={{
              width: 620,
              height: 440,
              title: '',
              xaxis: {
                title: item.xlabel,
                showgrid: true,
                zeroline: true,
              },
              yaxis: {
                title: item.ylabel,
                showgrid: true,
                zeroline: true,
              },
            }}
          />
        </div>
      ))}
    </div>
  )
}

//********************************************************//
//********************************************************//

const registeredPlugins = {
  //examples
  'My plugin': TestPlugin,
  Plotly: PlotlyPoc,
  'ESS Plot View': ESSPlotPlugin,
  'ESS Table View': ESSTablePlugin,
  'SRS Results View': SRSResultsView,

  //general dmt
  'Blueprint Table': BlueprintTable,
  'SIMOS Raw View': simos_raw_view,

  //MARMO views

  //SIMPOS generic
  'SIMA Report View': SimposReportView,
  'SIMA Status View': SimposStatusView,
  'SIMA RunOutput View': SimposRunOutputView,
  'SIMA Sce 3DView': SimposSce3DView,
  'SIMPOS Text File View': simpos_text_file_view,

  'LS Analysis Config': SingleObjectForm,
  'SIMA Application Service Config': SingleObjectForm,

  'Single Object Form': SingleObjectForm,

  //SRS views
  'SRS Env. Table': SRSEnvTable,

  //SRS forms
  'SRS Env. Form': SRSEnvForm,
  'SRS Sce Form': SRSSceForm,
  'SRS Simulation Config': SingleObjectForm,
  'SRS Simulation': SRSSceSimulationForm,

  //LS forms
  'LS Screening': LSSceForm,
  //RAO forms
  'RAO Calculator': RAOSceForm,

  //Testing
  'Adv. Table': MaterialTableDemo,
}

export default function pluginHook(uiRecipe) {
  return registeredPlugins[uiRecipe.name]
}
