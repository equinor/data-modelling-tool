import React, { useContext, useEffect, useState } from 'react'
import { Button, Progress } from '@equinor/eds-core-react'
// @ts-ignore
import { NotificationManager } from 'react-notifications'
import styled from 'styled-components'
import { AuthContext, DmssAPI, poorMansUUID } from '@dmt/common'
import { DEFAULT_DATASOURCE_ID } from './const'
import Result from './Result'
import Icons from './Icons'
import { TPlot, TGraph } from './types'

const StyledHeaderButton = styled(Button)`
  margin: 0 20px;
`

enum Blueprints {
  PLOTSTATE = 'ForecastDS/FoR-BP/Blueprints/PlotState',
  GRAPH = 'ForecastDS/FoR-BP/Blueprints/Graph',
}

export function FoRResultWrapper(props: {
  simulationConfig: any
  dottedId: string
  result: any
}) {
  const { simulationConfig, dottedId, result } = props
  const [plotWindows, setPlotWindows] = useState<any>({
    [poorMansUUID()]: { graphs: [] },
  })
  const [loading, setLoading] = useState<boolean>(false)
  const { token } = useContext(AuthContext)
  const dmssAPI = new DmssAPI(token)

  useEffect(() => {
    if (simulationConfig.plots) {
      // Retrieve the "stored plots"
      const storedPlots: any = {}
      simulationConfig.plots.map((storedPlot: any) => {
        storedPlots[poorMansUUID()] = storedPlot
      })
      setPlotWindows(storedPlots)
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
    getPlots: (): TPlot[] => {
      const plots: TPlot[] = []
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(plotWindows).forEach(([key, plotWindow]: any) => {
        plotWindow.graphs?.forEach((graph: TGraph) => {
          graph.type = Blueprints.GRAPH
        })
        plotWindow.type = Blueprints.PLOTSTATE
        plots.push(plotWindow)
      })
      return plots
    },
    addGraph: (plotKey: string, graph: TGraph): void => {
      const graphs: TGraph[] = plotWindows[plotKey]?.graphs || []
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

  function savePlots() {
    setLoading(true)
    // todo: add confirmation popup to ensure user intended the action
    simulationConfig.plots = plotWindowHandlers.getPlots()

    dmssAPI
      .documentUpdate({
        dataSourceId: DEFAULT_DATASOURCE_ID,
        documentId: dottedId.split('.', 1)[0],
        data: JSON.stringify(simulationConfig),
        attribute: dottedId.split('.').slice(1).join('.'),
      })
      .then(() =>
        NotificationManager.success('The plots were saved successfully.')
      )
      .catch((error: any) => {
        console.error(error)
        NotificationManager.error(
          error.message || 'An error occurred while saving the plots.'
        )
      })
      .finally(() => setLoading(false))
  }

  if (loading) return <Progress.Linear />

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        marginBottom: '30px',
      }}
    >
      <div style={{ alignSelf: 'end' }}>
        <Button
          style={{ width: '140px', marginLeft: '10px' }}
          variant="outlined"
          onClick={() => plotWindowHandlers.addPlotWindow()}
        >
          Add plot
          <Icons name="add" title="add" />
        </Button>
        <StyledHeaderButton
          style={{ width: '140px', marginLeft: '10px' }}
          onClick={() => savePlots()}
        >
          Save plots
          <Icons name="save" title="save" />
        </StyledHeaderButton>
      </div>

      {plotWindows &&
        Object.keys(plotWindows).map((plotKey: string, index) => (
          <Result
            key={index}
            result={result}
            plotKey={plotKey}
            plotWindowHandlers={{
              addPlotWindow: () => plotWindowHandlers.addPlotWindow(),
              deletePlotWindow: (plotKey: string) =>
                plotWindowHandlers.deletePlotWindow(plotKey),
              addGraph: (graph: TGraph) =>
                plotWindowHandlers.addGraph(plotKey, graph),
              getGraphs: () => plotWindowHandlers.getGraphs(plotKey),
              deleteGraph: (uuid: string) =>
                plotWindowHandlers.deleteGraph(plotKey, uuid),
            }}
            isRootPlot={index === 0}
          />
        ))}
    </div>
  )
}
