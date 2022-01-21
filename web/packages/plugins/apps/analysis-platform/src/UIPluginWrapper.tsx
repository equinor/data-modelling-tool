import { TSimulationConfig } from './Types'
import React, { useContext, useEffect, useState } from 'react'
import { useBlueprint, UiPluginContext } from '@dmt/common'
import { Button } from '@equinor/eds-core-react'
import styled from 'styled-components'
import { lightGray } from './components/Design/Colors'

const PluginSelectorWrapper = styled.div`
  border-bottom: 1px ${lightGray} solid;
  border-top: 1px ${lightGray} solid;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 5px 0;
  justify-content: space-evenly;
`

const SelectPluginButton = styled.div`
  padding: 5px 10px;
  text-align: center;
  width: -webkit-fill-available;
  border-bottom: ${(props: any) =>
    (props.active == true && '2px #017078FF solid') ||
    `2px ${lightGray} solid`};

  &:hover {
    background: ${lightGray};
    cursor: pointer;
  }
`

function UIPluginWrapper(props: {
  simulationConfig: TSimulationConfig
  dottedId: string
  entity: any
}) {
  const { simulationConfig, dottedId, entity } = props
  const [dataSourceId, documentId] = dottedId.split('.', 1)
  const [blueprint, loadingBlueprint, error] = useBlueprint(entity.type)
  const { loading, getUiPlugin } = useContext(UiPluginContext)
  const [selectedPlugin, setSelectedPlugin] = useState<number>(0)
  const [selectablePluginsComponent, setSelectablePluginsComponent] = useState<
    [string, Function][]
  >([])

  useEffect(() => {
    if (!blueprint) return
    if (!blueprint?.uiRecipes?.length) {
      setSelectablePluginsComponent(['yaml', getUiPlugin('yaml')])
    } else {
      setSelectablePluginsComponent(
        blueprint.uiRecipes.map((uiRecipe: any) => [
          uiRecipe?.plugin,
          getUiPlugin(uiRecipe?.plugin),
        ])
      )
    }
  }, [blueprint, loadingBlueprint])

  if (loadingBlueprint || loading) return <div>Loading...</div>

  if (error)
    return (
      <div style={{ color: 'red' }}>
        Failed to fetch Blueprint {entity.type}
      </div>
    )

  const UiPlugin = selectablePluginsComponent[selectedPlugin][1]

  return (
    <>
      <PluginSelectorWrapper>
        {selectablePluginsComponent.map((component, index) => (
          <SelectPluginButton
            key={index}
            onClick={() => setSelectedPlugin(index)}
            active={index === selectedPlugin}
          >
            {component[0]}
          </SelectPluginButton>
        ))}
      </PluginSelectorWrapper>
      <UiPlugin
        dataSourceId={dataSourceId}
        documentId={documentId}
        document={entity}
        result={entity}
        simulationConfig={simulationConfig}
        dottedId={dottedId}
      />
    </>
  )
}
export { UIPluginWrapper }
