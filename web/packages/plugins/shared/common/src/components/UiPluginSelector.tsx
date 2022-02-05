import React, { useContext, useEffect, useState } from 'react'
import { UiPluginContext, useBlueprint } from '@dmt/common'
import styled from 'styled-components'
import { DotProgress } from '@equinor/eds-core-react'

const lightGray = '#d3d3d3'

const PluginSelectorWrapper = styled.div`
  border-bottom: 1px ${lightGray} solid;
  border-top: 1px ${lightGray} solid;
  display: flex;
  align-items: center;
  margin: 5px 0;
  justify-content: space-evenly;
`
interface ISPButton {
  active: boolean
}

const SelectPluginButton = styled.div<ISPButton>`
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

export function UIPluginSelector(props: {
  dottedId: string
  entity: any
}): JSX.Element {
  const { dottedId, entity } = props
  const [dataSourceId, documentId] = dottedId.split('.', 1)
  const [blueprint, loadingBlueprint, error] = useBlueprint(entity.type)
  // @ts-ignore
  const { loading, getUiPlugin } = useContext(UiPluginContext)
  const [selectedPlugin, setSelectedPlugin] = useState<number>(0)
  const [selectablePluginsComponent, setSelectablePluginsComponent] = useState<
    [string, Function][]
  >([])

  useEffect(() => {
    if (!blueprint) return
    if (!blueprint.uiRecipes?.length) {
      setSelectablePluginsComponent(['yaml', getUiPlugin('yaml')])
    } else {
      setSelectablePluginsComponent(
        blueprint.uiRecipes.map((uiRecipe: any) => [
          uiRecipe?.name || uiRecipe?.plugin || 'no name',
          getUiPlugin(uiRecipe?.plugin),
        ])
      )
    }
  }, [blueprint, loadingBlueprint])

  if (loadingBlueprint || loading) return <DotProgress color="primary" />

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
        {selectablePluginsComponent.map(
          (component: [string, Function], index: number) => (
            <SelectPluginButton
              key={index}
              onClick={() => setSelectedPlugin(index)}
              active={index === selectedPlugin}
            >
              {component[0]}
            </SelectPluginButton>
          )
        )}
      </PluginSelectorWrapper>
      <UiPlugin
        dataSourceId={dataSourceId}
        documentId={documentId}
        document={entity}
        result={entity}
        dottedId={dottedId}
      />
    </>
  )
}
