import React from 'react'
import { PluginProps } from '../types'
import {
  VictoryTheme,
  VictoryChart,
  VictoryLine,
  VictoryContainer,
} from 'victory'
import { KeyValue } from '../BlueprintUtil'

type DataItem = {
  x: number
  y: number
}

type LineConfig = DataItem[]

type PlotConfig = {
  domain: any[]
  lineColors: string[]
  lines: LineConfig[]
}

function getAttributeNameFromMapping(
  mapping: string,
  attributes: KeyValue[],
  document: KeyValue,
  defaultValue: string
): string {
  const attr = attributes.find((attr: KeyValue) => attr.mapping === mapping)
  if (attr) {
    return document[attr.name]
  }
  return defaultValue
}

export const PlotPlugin = (props: PluginProps) => {
  const { document, uiRecipe } = props
  const mappings = {
    lines: uiRecipe.attributes
      .filter((attr: KeyValue) => attr.mapping === 'line')
      .map((attr: KeyValue) => attr.name),
    title: getAttributeNameFromMapping(
      'title',
      uiRecipe.attributes,
      document,
      'Plot'
    ),
  }

  const plotConfig: PlotConfig = {
    domain: [],
    lineColors: ['#50ff8a', '#ff9039'],
    lines: generateLineData(mappings),
  }

  function generateLineData(mappings: KeyValue): LineConfig[] {
    return mappings.lines.map((attrName: string) => {
      return createPlotData(attrName)
    })
  }

  function createPlotData(attrName: string): DataItem[] {
    return document[attrName].map((value: number, index: number) => {
      return {
        x: index + 1,
        y: value,
      }
    })
  }
  return (
    <div style={{}}>
      <div style={{ width: 'fit-content', marginTop: 30 }}>
        <div style={{ textAlign: 'center' }}>{mappings.title}</div>
        <VictoryChart
          width={600}
          height={250}
          theme={VictoryTheme.material}
          containerComponent={<VictoryContainer responsive={false} />}
        >
          {plotConfig.lines.map((value: any, index: number) => {
            return (
              <VictoryLine
                key={'multiLinePlot' + index}
                //domain={plotConfig.domain}
                style={{
                  data: { stroke: plotConfig.lineColors[index] },
                  parent: { border: '1px solid #ccc' },
                }}
                data={plotConfig.lines[index]}
              />
            )
          })}
        </VictoryChart>
      </div>
    </div>
  )
}
