// @ts-nocheck

import React, { useContext, useEffect, useState } from 'react'

import styled from 'styled-components'
import { CircularProgress } from '@equinor/eds-core-react'
import {
  IDmtUIPlugin,
  TDmtPlugin,
  UiPluginContext,
} from '../context/UiPluginContext'
import { AuthContext } from 'react-oauth2-code-pkce'
import { getRoles } from '../utils/appRoles'
import { ErrorBoundary } from '../utils/ErrorBoundary'
import { useBlueprint } from '../hooks'

const lightGray = '#d3d3d3'

const PluginTabsWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
`

const Wrapper = styled.div`
  align-self: start;
  justify-content: space-evenly;
  width: 100%;
`

const PathWrapper = styled.div`
  display: flex;
  opacity: 60%;
  justify-content: center;
  font-size: 14px;
  height: 20px;
  overflow: hidden;
`

const PathPartLink = styled.a`
  color: #007079;
  &:hover {
    color: #004f55;
    font-weight: bold;
  }
`

const PathPart = styled.div`
  margin-top: 0;
  margin-right: 15px;
`

const getHref = (
  dataSource: string,
  parts: string[],
  index: number
): string => {
  // Get the HREF for the document
  return parts.slice(0, index + 1).join('.')
}

export function DocumentPath(props: { absoluteDottedId: string }): JSX.Element {
  const { absoluteDottedId } = props
  const [dataSource, documentDottedId] = absoluteDottedId.split('/')
  const parts = documentDottedId.split('.')
  return (
    <PathWrapper>
      <PathPart>{dataSource}</PathPart>
      {parts.map((part: string, index: number) => {
        return (
          <div style={{ display: 'flex', flexWrap: 'nowrap' }} key={part}>
            <PathPart>/</PathPart>
            <PathPart
              as={PathPartLink}
              href={getHref(dataSource, parts, index)}
            >
              {part}
            </PathPart>
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

type TSelectablePlugins = {
  name: string
  component: (props: IDmtUIPlugin) => JSX.Element
  config: any
}

function filterPlugins(
  blueprint: any,
  categories: string[],
  roles: string[],
  getUIPlugin: (name: string) => TDmtPlugin
): TSelectablePlugins[] {
  let uiRecipes = blueprint.uiRecipes
  const fallbackPlugin = [
    { name: 'yaml', component: getUIPlugin('yaml-view').component, config: {} },
  ]
  // Blueprint has no recipes
  if (!uiRecipes.length) return fallbackPlugin

  // Filter on category and role
  uiRecipes = uiRecipes.filter((recipe: any) => {
    if (categories.length) {
      return categories.includes(recipe?.category)
    }
    return true
  })
  uiRecipes = uiRecipes.filter((recipe: any) => {
    // If no role filter on recipe, keep it. Else, only keep it if one of the active roles match one of the roles
    // given in recipe
    if (recipe.roles?.length) {
      return (
        roles.filter((activeRole: string) => recipe.roles.includes(activeRole))
          .length > 0
      )
    }
    return true
  })
  // If there are no recipes with the correct filter, show fallback
  if (!uiRecipes.length) {
    return fallbackPlugin
  }

  // Return the remaining recipes
  return uiRecipes.map((uiRecipe: any) => ({
    name: uiRecipe?.label || uiRecipe?.name || uiRecipe?.plugin || 'No name',
    component: getUIPlugin(uiRecipe?.plugin).component,
    config: uiRecipe?.config,
  }))
}

export function UIPluginSelector(props: {
  absoluteDottedId?: string
  type: string
  onSubmit?: (data: any) => void
  categories?: string[]
  breadcrumb?: boolean
  referencedBy?: string
  onOpen?: (data: any) => void
}): JSX.Element {
  const {
    absoluteDottedId,
    type,
    categories,
    breadcrumb,
    referencedBy,
    onSubmit,
    onOpen,
  } = props
  let [dataSourceId, documentId] = ['', '']
  if (absoluteDottedId) {
    dataSourceId = absoluteDottedId.split('/', 2)[0]
    documentId = absoluteDottedId.split('/', 2)[1]
  }
  const [blueprint, loadingBlueprint, error] = useBlueprint(type)
  const { loading, getUiPlugin } = useContext(UiPluginContext)
  const { tokenData } = useContext(AuthContext)
  const roles = getRoles(tokenData)
  const [selectedPlugin, setSelectedPlugin] = useState<number>(0)
  const [selectablePlugins, setSelectablePlugins] = useState<
    TSelectablePlugins[]
  >([])

  useEffect(() => {
    if (!blueprint) return
    setSelectablePlugins(
      filterPlugins(blueprint, categories || [], roles, getUiPlugin)
    )
  }, [blueprint])

  if (loadingBlueprint || loading)
    return (
      <div style={{ alignSelf: 'center', padding: '50px' }}>
        <CircularProgress color="primary" />
      </div>
    )

  if (error)
    return (
      <div style={{ color: 'red' }}>
        Failed to fetch Blueprint {type || '(unknown type)'}
      </div>
    )
  if (!selectablePlugins.length)
    return <Wrapper>No compatible uiRecipes for entity</Wrapper>

  const UiPlugin: (props: IDmtUIPlugin) => JSX.Element =
    selectablePlugins[selectedPlugin].component
  const config: any = selectablePlugins[selectedPlugin].config

  return (
    <Wrapper>
      {breadcrumb && (
        <DocumentPath absoluteDottedId={`${dataSourceId}/${documentId}`} />
      )}
      {referencedBy && <DocumentPath absoluteDottedId={referencedBy} />}
      {selectablePlugins.length > 1 && (
        <PluginTabsWrapper>
          {selectablePlugins.map(
            (component: TSelectablePlugins, index: number) => (
              <SelectPluginButton
                key={index}
                onClick={() => setSelectedPlugin(index)}
                active={index === selectedPlugin}
              >
                {component.name}
              </SelectPluginButton>
            )
          )}
        </PluginTabsWrapper>
      )}
      <ErrorBoundary
        key={selectablePlugins[selectedPlugin].name}
        fallBack={() => (
          <h4 style={{ color: 'red' }}>
            The UiPlugin <i>{selectablePlugins[selectedPlugin].name}</i>{' '}
            crashed...
          </h4>
        )}
      >
        <UiPlugin
          dataSourceId={dataSourceId}
          documentId={documentId}
          onSubmit={onSubmit}
          onOpen={onOpen}
          categories={categories}
          config={config}
        />
      </ErrorBoundary>
    </Wrapper>
  )
}
