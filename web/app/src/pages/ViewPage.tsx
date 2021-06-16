import React, { useEffect, useState } from 'react'
// @ts-ignore
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { DocumentAPI } from '@dmt/common'
// @ts-ignore
import { NotificationManager } from 'react-notifications'
import { getUIPlugin } from '@dmt/core-plugins'
import {
  GenerateUiRecipeTabs,
  getDefaultViewTabs,
} from './editor/layout-components/GenerateUiRecipeTabs'
import { UiRecipe } from '../domain/types'
import Tabs, { Tab, TabPanel } from '../components/Tabs'

const Group = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(175, 173, 173, 0.71);
  border-radius: 5px;
  padding: 20px 20px;
  background-color: white;
`

const documentAPI = new DocumentAPI()

const View = (props: any) => {
  const { dataSourceId, documentId, uiRecipe, document } = props
  const ExternalPlugin = getUIPlugin(uiRecipe.plugin)
  return (
    <ExternalPlugin
      dataSourceId={dataSourceId}
      documentId={documentId}
      uiRecipeName={uiRecipe.name}
      document={document}
    />
  )
}

// This is enlarge a duplicate of the ViewList in DocumentComponent.tsx with
// only view plugins (does not pass updateDocument(), explorer etc.)
const ViewList = (props: any) => {
  const generateUiRecipeTabs = new GenerateUiRecipeTabs(
    props.blueprintType.uiRecipes,
    getDefaultViewTabs(props.blueprintType.uiRecipes)
  )
  const uiRecipeTabs: UiRecipe[] = generateUiRecipeTabs.getTabs()

  return (
    <Tabs>
      <>
        {uiRecipeTabs.map((uiRecipe: UiRecipe) => {
          return (
            <Tab key={uiRecipe.name + uiRecipe.plugin} id={uiRecipe.plugin}>
              {uiRecipe.name}
            </Tab>
          )
        })}
      </>

      {uiRecipeTabs.map((uiRecipe: UiRecipe) => {
        return (
          <TabPanel key={uiRecipe.name + uiRecipe.plugin}>
            <View {...props} uiRecipe={uiRecipe} />
          </TabPanel>
        )
      })}
    </Tabs>
  )
}
export default () => {
  const { data_source, entity_id } = useParams()
  const [document, setDocument] = useState(null)
  const [blueprint, setBlueprint] = useState(null)

  useEffect(() => {
    documentAPI
      .getById(data_source, entity_id)
      .then((result) => {
        setBlueprint(result.blueprint)
        setDocument(result.document)
      })
      .catch((error) => {
        console.error(error)
        NotificationManager.error(error, 'Failed to fetch', 0)
      })
  }, [])

  return (
    <Group>
      <div>
        <b>DataSource:</b>
        <text style={{ marginLeft: '5px' }}>{data_source}</text>
      </div>
      <div>
        <b>Entity:</b>
        <text style={{ marginLeft: '5px' }}>{entity_id}</text>
      </div>
      {document && blueprint && (
        <ViewList document={document} blueprintType={blueprint} />
      )}
    </Group>
  )
}
