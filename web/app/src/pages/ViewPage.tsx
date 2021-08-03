import React, { useEffect, useState } from 'react'
// @ts-ignore
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { DocumentAPI } from '@dmt/common'
// @ts-ignore
import { NotificationManager } from 'react-notifications'
import { getUIPlugin } from '@dmt/core-plugins'
import { GenerateUiRecipeTabs } from './editor/layout-components/GenerateUiRecipeTabs'
import { UiRecipe } from '../domain/types'
import Tabs, { Tab, TabPanel } from '../components/Tabs'
import { createEntity } from '../utils/createEntity'
import useLocalStorage from '../hooks/useLocalStorage'
import { SimplifiedTree } from '../components/SimplifiedTree'

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
  const { dataSourceId, uiRecipe, document } = props
  const ExternalPlugin = getUIPlugin(uiRecipe.plugin)
  return (
    <ExternalPlugin
      dataSourceId={dataSourceId}
      documentId={document._id}
      uiRecipe={uiRecipe}
      uiRecipeName={uiRecipe.name}
      document={document}
      fetchBlueprint={(type: string) => documentAPI.getBlueprint(type)}
      createDocument={createEntity}
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
  const [selectedDataSource, setSelectedDataSource] = useLocalStorage(
    'searchDatasource',
    ''
  )
  const [packages, setPackages] = useState({})

  useEffect(() => {
    documentAPI
      .getById(data_source, entity_id)
      .then((result) => {
        setBlueprint(result.blueprint)
        setDocument(result.document)
        if (typeof selectedDataSource === 'string') {
          documentAPI
            .findPackages(selectedDataSource, result.document['_id'])
            .then((result) => {
              setPackages(result)
            })
        }
      })
      .catch((error) => {
        console.error(error)
        const errorMessage = JSON.parse(error.message).message
        setError(errorMessage)
        NotificationManager.error(errorMessage, 'Failed to fetch', 10)
      })
  }, [])

  if (!(document || blueprint))
    return <Group style={{ color: 'red' }}>{error}</Group>

  if (
    document === null ||
    Object.keys(packages).length === 0 ||
    typeof selectedDataSource !== 'string'
  )
    return <div></div>
  return (
    <Group>
      <div>
        <SimplifiedTree
          document={document}
          datasourceId={selectedDataSource}
          packages={packages}
        />
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
