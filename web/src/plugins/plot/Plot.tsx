import React from 'react'
import { Blueprint, PluginProps } from '../types'
// @ts-ignore
import { VictoryTheme, VictoryChart, VictoryLine } from 'victory'
import { findRecipe } from '../pluginUtils'
// @ts-ignore
import objectPath from 'object-path'
import { KeyValue } from '../BlueprintUtil'

export const PlotPlugin = (props: PluginProps) => {
  const { blueprint, document, uiRecipe } = props
  const options: KeyValue = {}
  const items = objectPath.get(document, options.property)
  const data = items.map((item: any) => {
    return {
      x: item[options.x],
      y: item[options.y],
    }
  })

  return (
    <VictoryChart theme={VictoryTheme.material}>
      <VictoryLine
        //domain={{x: [0, 10], y: [0, 40]}}
        style={{
          data: { stroke: '#c43a31' },
          parent: { border: '1px solid #ccc' },
        }}
        data={data}
      />
    </VictoryChart>
  )
}
