import React from 'react'

import { PlotType, TGraphInfo } from '../Result'
import {
  VictoryArea,
  VictoryAxis,
  VictoryChart,
  VictoryGroup,
  VictoryLine,
  VictoryScatter,
  VictoryTheme,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from 'victory'
import { plotColors } from './plotColors'

export type TLineChartDataPoint = {
  // @ts-ignore
  timestamp: string
  [key: string]: number
}

export default (props: {
  data: TLineChartDataPoint[]
  graphInfo: TGraphInfo[]
}): JSX.Element => {
  const { data, graphInfo } = props
  const fontSize: number = 8
  const victoryTooltip = (
    <VictoryTooltip
      style={{ fontSize: fontSize }}
      pointerLength={-60}
      centerOffset={{ y: -10 }}
      flyoutPadding={({ text }) =>
        text.length > 1 ? { top: 10, bottom: 10, left: 15, right: 15 } : 7
      }
    />
  )
  const chartWidth: number = 800
  const plotHeight: number = 200
  //TODO: Read threshold values from result file

  const getAreaPlotData = (
    data: TLineChartDataPoint[],
    graphInfo: TGraphInfo
  ) => {
    const plotData = data.map((dataPoint: TLineChartDataPoint) => {
      if (Array.isArray(dataPoint[graphInfo.name])) {
        const x = dataPoint.timestamp
        //@ts-ignore - ok since the if check makes sure dataPoint[graphInfo.name] is an array
        const y = dataPoint[graphInfo.name][1]
        //@ts-ignore - ok since the if check makes sure dataPoint[graphInfo.name] is an array
        const y0 = dataPoint[graphInfo.name][0]
        return {
          x: x,
          y0: y0,
          y: y,
          customLabel: `${x} \n ${graphInfo.name}: ${y0.toFixed(
            2
          )} - ${y.toFixed(2)}  ${graphInfo.unit}`,
        }
      } else {
        throw new Error(
          `Data for plot not in correct format! (Expected ${
            dataPoint[graphInfo.name]
          } to be an array)`
        )
      }
    })
    return plotData
  }
  const getLinePlotData = (
    data: TLineChartDataPoint[],
    graphInfo: TGraphInfo
  ) => {
    const plotData = data.map((dataPoint: TLineChartDataPoint) => {
      return {
        ...dataPoint,
        customLabel: `${dataPoint.timestamp} \n ${graphInfo.name}: ${dataPoint[
          graphInfo.name
        ].toFixed(2)} ${graphInfo.unit}`,
      }
    })
    return plotData
  }

  const getScatterStyle = (color: string, strokeWidth: number) => {
    return {
      data: {
        fill: color,
        fillOpacity: 1,
        strokeOpacity: 0,
        strokeWidth: strokeWidth,
      },
      labels: { fill: color },
    }
  }

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '1200px',
      }}
    >
      <VictoryChart
        width={chartWidth}
        height={plotHeight}
        theme={VictoryTheme.material}
        domainPadding={{ y: 20 }}
        padding={{ top: 5, bottom: 25, right: 5, left: 55 }}
        containerComponent={
          <VictoryVoronoiContainer
            labels={({ datum }) => datum.customLabel}
            labelComponent={victoryTooltip}
            voronoiBlacklist={['Line', 'Area']}
          />
        }
      >
        <VictoryAxis
          fixLabelOverlap={true}
          style={{ tickLabels: { fontSize: fontSize } }}
        />
        <VictoryAxis
          dependentAxis
          style={{ tickLabels: { fontSize: fontSize } }}
        />

        {graphInfo &&
          graphInfo.map((graphInfo: TGraphInfo, index) => {
            if (graphInfo.plotType === PlotType.LINE) {
              const linePlotScatterStyle = getScatterStyle(plotColors[index], 6)
              const plotData = getLinePlotData(data, graphInfo)
              return (
                <VictoryGroup key={index}>
                  <VictoryLine
                    name={'Line'}
                    key={index}
                    interpolation="natural"
                    style={{
                      data: { stroke: plotColors[index], strokeWidth: 1 },
                    }}
                    data={plotData}
                    y={graphInfo.name}
                    x={'timestamp'}
                  />
                  <VictoryScatter
                    name="LineScatter"
                    data={plotData}
                    style={linePlotScatterStyle}
                    size={1.5}
                    y={graphInfo.name}
                    x={'timestamp'}
                  />
                </VictoryGroup>
              )
            } else if (graphInfo.plotType === PlotType.SHADED) {
              const plotData = getAreaPlotData(data, graphInfo)
              const scatterPlotStyle = getScatterStyle(plotColors[index], 4)
              return (
                <VictoryGroup key={index}>
                  <VictoryArea
                    name={'Area'}
                    data={plotData}
                    interpolation="natural"
                    style={{
                      data: {
                        fill: plotColors[index],
                        fillOpacity: 0.6,
                        stroke: plotColors[index],
                        strokeWidth: 1,
                      },
                    }}
                  />
                  <VictoryScatter
                    name={'AreaScatter'}
                    size={0}
                    data={plotData}
                    style={scatterPlotStyle}
                  />
                </VictoryGroup>
              )
            } else {
              return <div key={index}></div>
            }
          })}
      </VictoryChart>
    </div>
  )
}
