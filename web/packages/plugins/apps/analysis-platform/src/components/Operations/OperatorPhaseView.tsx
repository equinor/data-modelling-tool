import React, { useEffect, useState } from 'react'
import { TGraph, TPhase, TSimulationConfig } from '../../Types'
import Result from '../Result'
import { sortSimulationsByNewest } from '../../utils/sort'
import { poorMansUUID } from '../../utils/uuid'

export default (props: { phase: TPhase }): JSX.Element => {
  const { phase } = props
  const [lastPublishedSimResult, setLastPublishedSimResult] = useState<any>(
    undefined
  )
  const [plotWindows, setPlotWindows] = useState<any>({
    [poorMansUUID()]: { graphs: [] },
  })

  useEffect(() => {
    // Find the published simConf
    const publishedSimulation:
      | TSimulationConfig
      | undefined = phase.simulationConfigs.find(
      (simConf: TSimulationConfig) => simConf?.published === true
    )
    // If there is a published sim with results. Load it's stored plots and set it in state.
    if (publishedSimulation && publishedSimulation?.results.length) {
      setLastPublishedSimResult(
        sortSimulationsByNewest(publishedSimulation.results)[0]
      )
      if (publishedSimulation?.plots?.length) {
        let storedPlots: any = {}
        publishedSimulation.plots.map(
          (storedPlot) => (storedPlots[poorMansUUID()] = storedPlot)
        )
        setPlotWindows(storedPlots)
      }
    }
  }, [])

  const plotWindowHandlers = {
    addPlotWindow: (key: string = poorMansUUID()): void => {
      setPlotWindows({ ...plotWindows, [key]: { graphs: [] } })
    },
    deletePlotWindow: (key: string): void => {
      const plots: any = plotWindows
      delete plots[key]
      setPlotWindows({ ...plots })
    },
    addGraph: (plotKey: string, graph: TGraph): void => {
      const graphs: TGraph[] = plotWindows[plotKey].graphs
      graphs.push(graph)
      setPlotWindows({ ...plotWindows, [plotKey]: { graphs: graphs } })
    },
    getGraphs: (plotKey: string): TGraph[] => {
      return plotWindows[plotKey].graphs
    },
    deleteGraph: (plotKey: string, uuid: string) => {
      let graphs: TGraph[] = plotWindows[plotKey].graphs
      graphs = graphs.filter((graph) => graph.uuid !== uuid)
      setPlotWindows({ ...plotWindows, [plotKey]: { graphs: graphs } })
    },
  }

  if (!lastPublishedSimResult)
    return <div>No results have been published for this operation phase</div>

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}
    >
      <div
        style={{ padding: '16px', display: 'flex', flexDirection: 'column' }}
      >
        <label>Viewing most recent result: {lastPublishedSimResult.name}</label>
        <div>
          {plotWindows &&
            lastPublishedSimResult &&
            Object.keys(plotWindows).map((plotKey: string, plotKeyIndex) => (
              <Result
                key={`plotWindow-${plotKey}`}
                result={lastPublishedSimResult}
                plotKey={plotKey}
                plotWindowHandlers={{
                  addPlotWindow: (plotKey?: string | undefined) =>
                    plotWindowHandlers.addPlotWindow(),
                  deletePlotWindow: (plotKey: string) =>
                    plotWindowHandlers.deletePlotWindow(plotKey),
                  addGraph: (graph: TGraph) =>
                    plotWindowHandlers.addGraph(plotKey, graph),
                  getGraphs: () => plotWindowHandlers.getGraphs(plotKey),
                  deleteGraph: (uuid: string) =>
                    plotWindowHandlers.deleteGraph(plotKey, uuid),
                }}
                isRootPlot={plotKeyIndex == 0}
              />
            ))}
        </div>
      </div>
    </div>
  )
}
