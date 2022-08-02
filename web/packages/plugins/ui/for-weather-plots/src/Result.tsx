import React, { useEffect, useState, ChangeEvent } from 'react'
import LinesOverTime, { TLineChartDataPoint } from './Plots/LinesOverTime'
import { Button, Chip, Progress, Tooltip } from '@equinor/eds-core-react'
//@ts-ignore
import { NotificationManager } from 'react-notifications'
import styled from 'styled-components'
import { useDocument, poorMansUUID } from '@dmt/common'

import ArrowPlots from './Plots/ArrowPlots'
import { DEFAULT_DATASOURCE_ID } from './const'
import { plotColors } from './Plots/plotColors'
import Icons from './Icons'
import { TGraph } from './types'

const ResultWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px 0;
`

type IconWrapperProps = {
  color?: any
}

export const IconWrapper = styled.div<IconWrapperProps>`
  width: 22px;
  height: 22px;
  color: ${(props: IconWrapperProps) => props?.color};
  font-size: x-large;
  padding: 0 3px;
  display: flex;
  align-items: center;
`

export const StyledSelect = styled.select`
  position: relative;
  font-size: medium;
  padding: 8px 16px;
  border: 0;
  border-bottom: 2px solid #dbdbdb;
  cursor: pointer;
  width: fit-content;
  background-color: #f7f7f7;
  min-width: 150px;
`

const AddedGraphWrapper = styled.div`
  display: flex;
  margin: 15px 15px;
  flex-wrap: wrap;
`

const GraphSelectorWrapper = styled.div`
  display: flex;
  padding-top: 20px;
`

function GraphSelect(props: {
  variableRuns: any[]
  chartData: any
  setChartData: (newChartData: TLineChartDataPoint[]) => void
  graphInfo: TGraphInfo[]
  setGraphInfo: (newGraphdata: TGraphInfo[]) => void
  plotKey: string
  plotWindowHandlers: {
    deletePlotWindow: (plotKey: string) => void
    addGraph: (graph: TGraph) => void
    getGraphs: () => TGraph[]
  }
  isRootPlot?: boolean
}) {
  const {
    variableRuns,
    chartData,
    setChartData,
    graphInfo,
    setGraphInfo,
    plotKey,
    plotWindowHandlers,
    isRootPlot,
  } = props
  const [chosenRun, setChosenRun] = useState<number>(0)
  const [chosenResponse, setChosenResponse] = useState<number>(0)
  const [chosenStatistic, setChosenStatistic] = useState<number>(0)

  useEffect(() => {
    setChosenResponse(0)
  }, [chosenRun])

  useEffect(() => {
    setChosenStatistic(0)
  }, [chosenResponse])

  useEffect(() => {
    const storedGraphs = plotWindowHandlers.getGraphs()
    if (storedGraphs) {
      const newGraphInfo: TGraphInfo[] = []
      const newDataDict: any = {}
      storedGraphs.forEach((storedGraph) => {
        const [newGraph, newData] = createGraph(
          storedGraph.run,
          storedGraph.response,
          storedGraph.statistic,
          storedGraph.uuid
        )
        newGraphInfo.push(newGraph)
        Object.entries(newData).forEach(([key, value]: any) => {
          newDataDict[key] = { ...newDataDict[key], ...value }
        })
      })
      setGraphInfo(newGraphInfo)
      setChartData(Object.values(newDataDict))
    }
  }, [])

  function addGraphFromSelector() {
    const uuid = poorMansUUID()
    const newGraphInfo: TGraphInfo[] = graphInfo
    const newDataDict: any = {}
    const [newGraph, newData] = createGraph(
      chosenRun,
      chosenResponse,
      chosenStatistic,
      uuid
    )
    // Add graph if not already present
    if (newGraph) {
      newGraphInfo.push(newGraph)
      setGraphInfo(newGraphInfo)
      Object.entries(newData).forEach(([key, value]: any) => {
        newDataDict[key] = { ...newDataDict[key], ...value }
      })
      setChartData(Object.values(newDataDict))
      const graph: TGraph = {
        run: chosenRun,
        response: chosenResponse,
        statistic: chosenStatistic,
        uuid: uuid,
      }
      plotWindowHandlers.addGraph(graph)
    } else {
      NotificationManager.info(
        'The selected graph is already present in the plot.'
      )
    }
  }

  function createGraph(
    run: number,
    response: number,
    statistic: number,
    uuid: string = poorMansUUID()
  ) {
    // Get the timeseries and values from the selected statistic
    const result = variableRuns[run].responses[response].statistics[statistic]

    const runName = `${variableRuns[run].name}`
    const responseName = `${variableRuns[run].responses[response].name}`
    const statisticName = `${variableRuns[run].responses[response].statistics[statistic].name}`
    // Generate a unique name for the graph based on the names of the parents
    const graphName = `${runName}: ${responseName} ${statisticName}`
    const description = `${variableRuns[run].responses[response].statistics[statistic].description}`

    if (graphInfo.map((graph) => graph.name).includes(graphName))
      return [false, {}] // graph already present
    const newDataDict: any = {}

    // Create a object for the chartData array (so we can lookup on timestamp)
    chartData.forEach(
      (dataPoint: any) => (newDataDict[dataPoint.timestamp] = dataPoint)
    )

    // Add the new values into the possibly existing timestamp (x-axis), spreading any existing values into it
    result.datetimes.forEach((timestamp: string, index: number) => {
      let newDataPoint: TLineChartDataPoint = newDataDict[timestamp]
      if (result?.plotType == 'shaded') {
        // For AreaChart(shaded), there are twice as many values (upper and lower), as timestamps.
        // Value @ index 1 is lower value for upper value found at index=values.length/2+index
        newDataPoint = {
          timestamp: timestamp,
          [graphName]: [
            result.values[index],
            result.values[result.values.length / 2 + index],
          ],
          ...newDataDict[timestamp],
        }
      } else {
        newDataPoint = {
          timestamp: timestamp,
          [graphName]: result.values[index],
          ...newDataDict[timestamp],
        }
      }
      newDataDict[timestamp] = newDataPoint
    })

    return [
      {
        name: graphName,
        plotType: result?.plotType,
        unit: result?.unit,
        description: description,
        uuid: uuid,
      },
      newDataDict,
    ]
  }

  return (
    <GraphSelectorWrapper>
      <StyledSelect
        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
          setChosenRun(parseInt(e.target.value))
        }
      >
        {variableRuns.map((run: any, index) => (
          <option key={index} value={index}>
            {run.name}
          </option>
        ))}
      </StyledSelect>
      <StyledSelect
        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
          setChosenResponse(parseInt(e.target.value))
        }
      >
        {variableRuns[chosenRun].responses.map(
          (response: any, index: number) => (
            <option key={index} value={index}>
              {response.name}
            </option>
          )
        )}
      </StyledSelect>
      <StyledSelect
        onSelect={(e: ChangeEvent<HTMLSelectElement>) =>
          setChosenStatistic(parseInt(e.target.value))
        }
      >
        {variableRuns[chosenRun].responses[chosenResponse].statistics.map(
          (statistic: any, index: number) => (
            <option key={index} value={index}>
              {statistic.name}
            </option>
          )
        )}
      </StyledSelect>
      <Button
        style={{ width: '140px', marginLeft: '10px' }}
        onClick={() => {
          addGraphFromSelector()
        }}
      >
        Add graph
        <Icons name="add" title="add" />
      </Button>
      {!isRootPlot && (
        <Button
          style={{ marginLeft: 'auto', marginRight: 0 }}
          variant="ghost_icon"
          onClick={() => plotWindowHandlers.deletePlotWindow(plotKey)}
        >
          <Icons name="close" title="close graph" />
        </Button>
      )}
    </GraphSelectorWrapper>
  )
}

export enum PlotType {
  SHADED = 'shaded',
  LINE = 'line',
  ARROW = 'arrow',
}

export type TGraphInfo = {
  name: string
  unit: string
  plotType: PlotType
  description: string
  uuid: string
}

export default (props: {
  result: any
  plotKey: string
  plotWindowHandlers: {
    addPlotWindow: (plotKey?: string | undefined) => void
    deletePlotWindow: (plotKey: string) => void
    addGraph: (graph: TGraph) => void
    getGraphs: () => TGraph[]
    deleteGraph: (uuid: string) => void
  }
  isRootPlot?: boolean
}) => {
  const { result, plotKey, plotWindowHandlers, isRootPlot } = props
  const [graphInfo, setGraphInfo] = useState<TGraphInfo[]>([])
  const [variableRuns, setVariableRuns] = useState<any[]>([])
  const [chartData, setChartData] = useState<TLineChartDataPoint[]>([])
  const [document, isLoading, updateDocument, error] = useDocument<any>(
    DEFAULT_DATASOURCE_ID,
    result._id,
    999
  )

  useEffect(() => {
    if (!isLoading && document && Object.keys(document).length) {
      setVariableRuns(document.variableRuns)
    }
  }, [document, isLoading])

  useEffect(() => {
    setGraphInfo([])
  }, [result])

  function removeGraph(name: string, uuid: string) {
    const newDataDict: any = {}

    chartData.forEach((dataPoint: any) => {
      delete dataPoint[name]
      newDataDict[dataPoint.timestamp] = dataPoint
    })

    setGraphInfo(graphInfo.filter((graph: TGraphInfo) => name !== graph.name))
    setChartData(Object.values(newDataDict))
    plotWindowHandlers.deleteGraph(uuid)
  }

  if (isLoading) return <Progress.Linear style={{ margin: '20px' }} />

  if (!variableRuns.length)
    return <div style={{ paddingTop: '10px' }}>No variableRuns in result</div>

  if (error) {
    NotificationManager.error(error.message)
    return <div />
  }

  return (
    <div>
      <ResultWrapper>
        <div>
          <GraphSelect
            variableRuns={variableRuns}
            chartData={chartData}
            setChartData={setChartData}
            setGraphInfo={setGraphInfo}
            graphInfo={graphInfo}
            plotKey={plotKey}
            plotWindowHandlers={{
              deletePlotWindow: (plotKey: string) =>
                plotWindowHandlers.deletePlotWindow(plotKey),
              addGraph: (graph: TGraph) => plotWindowHandlers.addGraph(graph),
              getGraphs: () => plotWindowHandlers.getGraphs(),
            }}
            isRootPlot={isRootPlot}
          />
          {graphInfo.length >= 1 && (
            <AddedGraphWrapper>
              {graphInfo.map((graph: TGraphInfo, graphIndex) => (
                <Tooltip title={graph.description} key={graphIndex}>
                  <Chip
                    key={graphIndex}
                    style={{ margin: '10px 5px', cursor: 'help', zIndex: 1 }}
                    variant="active"
                    onDelete={() => removeGraph(graph.name, graph.uuid)}
                  >
                    <IconWrapper color={plotColors[graphIndex]}>
                      &#9679;
                    </IconWrapper>
                    {graph.name}
                  </Chip>
                </Tooltip>
              ))}
            </AddedGraphWrapper>
          )}
        </div>
        <LinesOverTime data={chartData} graphInfo={graphInfo} />
        <ArrowPlots data={chartData} graphInfo={graphInfo} />
      </ResultWrapper>
    </div>
  )
}
