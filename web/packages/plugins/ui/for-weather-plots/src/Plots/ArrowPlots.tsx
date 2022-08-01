import React from 'react'
import { PlotType, TGraphInfo } from '../Result'
import {
  VictoryAxis,
  VictoryChart,
  VictoryLabel,
  VictoryScatter,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from 'victory'
import { Icon } from '@equinor/eds-core-react'
import { TLineChartDataPoint } from './LinesOverTime'
import { plotColors } from './plotColors'

type RotatedArrowProps = {
  datum: any
  x: number
  y: number
  attributeNameForData: string
  color: string
}

// RotatedArrow must be class component to get correct props from VictoryChart
class RotatedArrow extends React.Component<RotatedArrowProps> {
  render() {
    const { datum, x, y, attributeNameForData, color } = this.props
    const iconWidth: 16 | 24 | 32 | 40 | 48 = 16

    //offset to center the arrows in the plot - this value depends on height of plot window
    const yAxisOffset = 25
    const translation = `${x - iconWidth / 2}, ${
      y + yAxisOffset - iconWidth / 2
    }`
    // Rotate the arrow an extra 180 degree, so it points in the "going to" direction
    const rotation = `${datum[attributeNameForData] - 180}, ${iconWidth / 2}, ${
      iconWidth / 2
    }`

    return (
      <g transform={`translate(${translation}) rotate(${rotation})`}>
        <Icon name="arrow_up" size={iconWidth} color={color} />
      </g>
    )
  }
}

export default (props: {
  data: TLineChartDataPoint[]
  graphInfo: TGraphInfo[]
}): JSX.Element => {
  const { data, graphInfo } = props

  const fontSize = 8

  const chartWidth = 800
  const arrowPlotHeight = 60

  return (
    <div
      style={{
        width: '100%',
      }}
    >
      {graphInfo &&
        graphInfo.map((graphInfo: TGraphInfo, index) => {
          if (graphInfo.plotType === PlotType.ARROW) {
            const plotData = data.map((dataPoint) => {
              return { ...dataPoint, y: 0 }
            })
            const tooltipOffset = 30
            return (
              <VictoryChart
                key={index}
                width={chartWidth}
                height={arrowPlotHeight}
                containerComponent={<VictoryVoronoiContainer />}
              >
                <VictoryLabel
                  x={10}
                  y={10}
                  text={graphInfo.name}
                  style={{ fontSize: fontSize }}
                />
                <VictoryScatter
                  data={plotData}
                  x="timestamp"
                  y="y"
                  dataComponent={
                    //@ts-ignore
                    <RotatedArrow
                      attributeNameForData={graphInfo.name}
                      color={plotColors[index]}
                    />
                  }
                  style={{ labels: { fontSize: fontSize } }}
                  labels={({ datum }) => {
                    return `${datum.timestamp} \n ${graphInfo.name}: ${datum[
                      graphInfo.name
                    ].toFixed(2)} ${graphInfo.unit}`
                  }}
                  labelComponent={
                    <VictoryTooltip
                      y={tooltipOffset}
                      flyoutPadding={({ text }) =>
                        text.length > 1
                          ? { top: 10, bottom: 10, left: 15, right: 15 }
                          : 7
                      }
                    />
                  }
                />
                <VictoryAxis
                  dependentAxis={true}
                  style={{
                    axis: { opacity: 0 },
                    ticks: { opacity: 0 },
                    tickLabels: { opacity: 0 },
                  }}
                />
              </VictoryChart>
            )
          } else {
            return <div key={index}></div>
          }
        })}
    </div>
  )
}
