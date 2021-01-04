import React from 'react'
import Plot from 'react-plotly.js'
import { BlueprintTable } from './dmt/views/BlueprintTable.js'

/**
 * Work space for attaching plugin to the dmt tool.
 * External dependencies:
 * - option1: should either be provided by the DMT (in package.json)
 * - option2: create a lib folder and add transpiled javascript files. Similar to dist folders in node_modules.
 *
 * External plugins must have a unique name, not conflicting with the DMT official plugin names.
 */

const TestPlugin = ({ parent, document, children }) => {
  return 'test plugin'
}

const registeredPlugins = {
  'Table(BP)': BlueprintTable,
  Plotly: PlotlyPoc,
}

export default function pluginHook(uiRecipe) {
  return registeredPlugins[uiRecipe.name]
}

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
