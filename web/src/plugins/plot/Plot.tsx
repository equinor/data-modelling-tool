import React from 'react'
import { Blueprint } from '../types'
// @ts-ignore
import { VictoryTheme, VictoryChart, VictoryLine } from 'victory'
import { findRecipe } from '../pluginUtils'
// @ts-ignore
import objectPath from 'object-path'

interface Props {
  name: string
  parent: Blueprint
  blueprint: Blueprint
  children: Blueprint[]
}

export const PlotPlugin = (props: Props) => {
  const { name, parent, blueprint, children } = props

  const uiRecipe = findRecipe(props.parent, props.name)

  const items = objectPath.get(blueprint, uiRecipe.options.property)
  const data = items.map((item: any) => {
    return {
      x: item[uiRecipe.options.x],
      y: item[uiRecipe.options.y],
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
