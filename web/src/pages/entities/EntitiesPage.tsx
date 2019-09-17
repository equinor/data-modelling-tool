import React, { useEffect, useReducer } from 'react'
import DocumentTree from '../common/tree-view/DocumentTree'
import EntitiesReducer, {
  DocumentActions,
  initialState,
} from '../common/DocumentsReducer'
import { DataSourceType, DmtApi, IndexNode } from '../../api/Api'
import axios from 'axios'
import { EntityNode } from './nodes/EntityNode'
import { FolderNode } from './nodes/FolderNode'
import { RootFolderNode } from './nodes/RootFolderNode'
import BlueprintPicker from './BlueprintPicker'
import Header from '../../components/Header'
import { Wrapper } from '../blueprints/BlueprintsPage'
import Button from '../../components/Button'
import { DataSourceNode } from '../blueprints/nodes/DataSourceNode'

const api = new DmtApi()

function getNodeComponent(node: IndexNode) {
  switch (node.nodeType) {
    case 'folder':
      if (node.isRoot) {
        return RootFolderNode
      } else {
        return FolderNode
      }
    case 'file':
      return EntityNode
    case 'datasource':
      return DataSourceNode
    default:
      return () => <div>{node.title}</div>
  }
}

export default () => {
  const [state, dispatch] = useReducer(EntitiesReducer, initialState)
  // const pageMode = state.pageMode

  //not use useFetch hook because response should be dispatched to the reducer.
  useEffect(() => {
    //avoid unnecessary fetch.
    if (!state.dataSources.length) {
      axios(api.dataSourcesGet(DataSourceType.Entities))
        .then((res: any) => {
          dispatch(DocumentActions.addDatasources(res.data))
        })
        .catch((e: any) => {
          console.log(e)
        })
    }
  }, [state.dataSources.length])

  return (
    <Wrapper>
      <Header style={{ marginBottom: 20 }}>
        <Button>Add datasource</Button>
        {/* TODO move picker to context menu. */}
        <BlueprintPicker state={state} dispatch={dispatch} />
      </Header>
      <br />
      <DocumentTree
        state={state}
        dataSources={state.dataSources}
        dispatch={dispatch}
        getNodeComponent={getNodeComponent}
      />
    </Wrapper>
  )
}
