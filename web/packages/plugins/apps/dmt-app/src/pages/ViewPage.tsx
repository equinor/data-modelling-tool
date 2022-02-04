import React, { useContext, useEffect, useState } from 'react'
// @ts-ignore
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import {
  DmtAPI,
  DmssAPI,
  AuthContext,
  useDocument,
  UiPluginContext,
  ApplicationContext,
} from '@dmt/common'
// @ts-ignore
import { NotificationManager } from 'react-notifications'
import { GenerateUiRecipeTabs } from './editor/layout-components/GenerateUiRecipeTabs'
import { UiRecipe } from '../domain/types'
import Tabs, { Tab, TabPanel } from '../components/Tabs'
import { SimplifiedTree } from '../components/SimplifiedTree'
import { ErrorGroup } from '../components/Wrappers'

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
  const { dataSourceId, uiRecipe, document, documentId, updateDocument } = props
  const { getUiPlugin } = useContext(UiPluginContext)
  const UiPlugin = getUiPlugin(uiRecipe.plugin)
  // @ts-ignore-line
  const { token } = useContext(AuthContext)
  const dmssAPI = new DmssAPI(token)
  return (
    <UiPlugin
      dataSourceId={dataSourceId}
      documentId={document._id}
      uiRecipe={uiRecipe}
      uiRecipeName={uiRecipe.name}
      updateDocument={updateDocument}
      document={document}
      fetchBlueprint={(typeRef: string) => dmssAPI.getBlueprint({ typeRef })}
      createDocument={dmtAPI.createEntity}
    />
  )
}

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
export default ({ settings }: any) => {
  const { data_source, entity_id } = useParams()
  const [document, documentLoading, setDocument, error] = useDocument(
    data_source,
    entity_id
  )
  const [blueprint, setBlueprint] = useState<Object | null>(null)
  const [blueprintError, setBlueprintError] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)

  // @ts-ignore-line
  const { token } = useContext(AuthContext)
  const dmssAPI = new DmssAPI(token)

  useEffect(() => {
    if (!document?.type) return
    dmssAPI
      .getBlueprint({ typeRef: document.type })
      .then((v: any) => setBlueprint(v))
      .catch((error: Error) => setBlueprintError(error))
      .finally(() => setLoading(false))
  }, [documentLoading])

  if (error || blueprintError)
    return (
      <ErrorGroup>
        <b>Error</b>
        <b>
          Failed to fetch document and blueprint
          <code>
            {data_source}/{entity_id}
          </code>
        </b>
      </ErrorGroup>
    )

  return (
    <>
      <ApplicationContext.Provider
        value={{ ...settings, displayAllDataSources: true }}
      >
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
              updateDocument={setDocument}
              dataSource={data_source}
              documentId={entity_id}
            />
          )}
        </Group>
      </ApplicationContext.Provider>
    </>
  )
}
