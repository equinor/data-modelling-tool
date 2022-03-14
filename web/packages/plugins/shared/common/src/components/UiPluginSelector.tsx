import React, {
  useContext,
  useEffect,
  useState,
  FunctionComponent,
} from 'react'
import { DmtUIPlugin, UiPluginContext, useBlueprint } from '@dmt/common'
import styled from 'styled-components'
import { DotProgress } from '@equinor/eds-core-react'

const lightGray = '#d3d3d3'

const PluginTabsWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  padding-bottom: 15px;
`

const Wrapper = styled.div`
  align-self: start;
  justify-content: space-evenly;
`

const PathWrapper = styled.div`
  display: flex;
  opacity: 60%;
  justify-content: center;
  font-size: 14px;
  height: 20px;
  overflow: hidden;
`

const PathPart = styled.div`
  margin-top: 0;
  margin-right: 15px;
`

export function DocumentPath(props: { absoluteDottedId: string }): JSX.Element {
  const { absoluteDottedId } = props
  const parts = absoluteDottedId.split('.')
  return (
    <PathWrapper>
      {parts.map((part: string) => {
        return (
          <div style={{ display: 'flex', flexWrap: 'nowrap' }} key={part}>
            <PathPart>/</PathPart>
            <PathPart>{part}</PathPart>
          </div>
        )
      })}
    </PathWrapper>
  )
}

interface ISPButton {
  active: boolean
}

const SelectPluginButton = styled.div<ISPButton>`
  padding: 5px 10px;
  text-align: center;
  width: 100%;
  border-bottom: ${(props: any) =>
    (props.active == true && '2px #017078FF solid') ||
    `2px ${lightGray} solid`};
  &:hover {
    background: ${lightGray};
    cursor: pointer;
  }
`

export function UIPluginSelector(props: {
  absoluteDottedId: string
  entity: any
  onSubmit?: Function
  onChange?: Function
  categories?: string[]
  breadcrumb?: boolean
  onOpen?: Function
}): JSX.Element {
  const {
    absoluteDottedId,
    entity,
    categories,
    breadcrumb,
    onSubmit,
    onChange,
    onOpen,
  } = props
  const [dataSourceId, documentId] = absoluteDottedId.split('/', 2)
  const [blueprint, loadingBlueprint, error] = useBlueprint(entity.type)
  // @ts-ignore
  const { loading, getUiPlugin } = useContext(UiPluginContext)
  const [selectedPlugin, setSelectedPlugin] = useState<number>(0)
  const [selectableRecipe, setSelectableRecipe] = useState<
    // name, component, config
    [string, Function, any][]
  >([])

  useEffect(() => {
    if (!blueprint) return
    let recipesToUse = blueprint.uiRecipes
    if (categories?.length) {
      recipesToUse = recipesToUse.filter((recipe: any) =>
        categories.includes(recipe?.category)
      )
    }
    if (!recipesToUse?.length && !categories) {
      setSelectableRecipe(['yaml', getUiPlugin('yaml'), undefined])
    } else {
      setSelectableRecipe(
        recipesToUse.map((uiRecipe: any) => [
          uiRecipe?.label || uiRecipe?.name || uiRecipe?.plugin || 'no name',
          getUiPlugin(uiRecipe?.plugin),
          uiRecipe?.config,
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
  if (!selectableRecipe.length) {
    return <Wrapper>No compatible uiRecipes for entity</Wrapper>
  }
  const UiPlugin: FunctionComponent<DmtUIPlugin> = selectableRecipe[
    selectedPlugin
  ][1] as FunctionComponent
  const config: any = selectableRecipe[selectedPlugin][2]

  return (
    <Wrapper>
      {breadcrumb && (
        <DocumentPath absoluteDottedId={`${dataSourceId}/${documentId}`} />
      )}
      {selectableRecipe.length > 1 && (
        <PluginTabsWrapper>
          {selectableRecipe.map(
            (component: [string, Function, any], index: number) => (
              <SelectPluginButton
                key={index}
                onClick={() => setSelectedPlugin(index)}
                active={index === selectedPlugin}
              >
                {component[0]}
              </SelectPluginButton>
            )
          )}
        </PluginTabsWrapper>
      )}
      <UiPlugin
        dataSourceId={dataSourceId}
        documentId={documentId}
        document={entity}
        onSubmit={onSubmit}
        onChange={onChange}
        onOpen={onOpen}
        categories={categories}
        config={config}
      />
    </Wrapper>
  )
}
