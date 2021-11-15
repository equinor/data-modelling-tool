import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from 'react-oauth2-code-pkce'
// @ts-ignore
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { DmtAPI, DmssAPI } from '@dmt/common'
// @ts-ignore
import { NotificationManager } from 'react-notifications'
import { getUIPlugin } from '@dmt/core-plugins'
import { GenerateUiRecipeTabs } from './editor/layout-components/GenerateUiRecipeTabs'
import { UiRecipe } from '../domain/types'
import Tabs, { Tab, TabPanel } from '../components/Tabs'
import { SimplifiedTree } from '../components/SimplifiedTree'

const Group = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(175, 173, 173, 0.71);
  border-radius: 5px;
  padding: 20px 20px;
  background-color: white;
`

const dmtAPI = new DmtAPI()

const View = (props: any) => {
  const { dataSourceId, uiRecipe, document } = props
  const ExternalPlugin = getUIPlugin(uiRecipe.plugin)
  const { token } = useContext(AuthContext)
  const dmssAPI = new DmssAPI(token)
  return (
    <ExternalPlugin
      dataSourceId={dataSourceId}
      documentId={document._id}
      uiRecipe={uiRecipe}
      uiRecipeName={uiRecipe.name}
      document={document}
      fetchBlueprint={(typeRef: string) => dmssAPI.getBlueprint({ typeRef })}
      createDocument={dmtAPI.createEntity}
    />
  )
}

// This is enlarge a duplicate of the ViewList in DocumentComponent.tsx with
// only view plugins (does not pass updateDocument(), explorer etc.)
const ViewList = (props: any) => {
  const generateUiRecipeTabs = new GenerateUiRecipeTabs(
    props.blueprintType.uiRecipes
  )
  const uiRecipeTabs: UiRecipe[] = generateUiRecipeTabs.uiRecipeTabs

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
            <View
              {...props}
              uiRecipe={uiRecipe}
              dataSourceId={props.dataSource}
            />
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
  const [error, setError] = useState(null)
  const { token } = useContext(AuthContext)
  const dmssAPI = new DmssAPI(token)

  useEffect(() => {
    dmssAPI
      .getDocumentById({ dataSourceId: data_source, documentId: entity_id })
      .then((result) => {
        setBlueprint(result.blueprint)
        setDocument(result.document)
      })
      .catch((error) => {
        console.error(error)
        const errorMessage = JSON.parse(error.message).message
        setError(errorMessage)
        NotificationManager.error(errorMessage, 'Failed to fetch', 10)
      })
  }, [])

  if (!document || !blueprint)
    return <Group style={{ color: 'red' }}>{error}</Group>

  return (
    <Group>
      <div>
        <SimplifiedTree document={document} datasourceId={data_source} />
      </div>
      <div>
        <b>DataSource:</b>
        <p style={{ marginLeft: '5px' }}>{data_source}</p>
      </div>
      <div>
        <b>Entity:</b>
        <p style={{ marginLeft: '5px' }}>{entity_id}</p>
      </div>
      {document && blueprint && (
        <ViewList
          document={document}
          blueprintType={blueprint}
          dataSource={data_source}
        />
      )}
    </Group>
  )
}
