import React, { useEffect, useReducer } from 'react'
import styled from 'styled-components'
import BlueprintReducer, {
  DocumentActions,
  initialState,
} from '../common/DocumentsReducer'
import { DataSourceType, DmtApi, IndexNode } from '../../api/Api'
import axios from 'axios'
import { FolderNode } from './nodes/FolderNode'
import { BlueprintNode } from './nodes/BlueprintNode'
import DocumentTree from '../common/tree-view/DocumentTree'
import { RootFolderNode } from './nodes/RootFolderNode'
import Header from '../../components/Header'
import AddDatasource from '../common/tree-view/AddDatasource'
import { DataSourceNode } from './nodes/DataSourceNode'
import { DocumentType } from '../../util/variables'

const api = new DmtApi()

export const Wrapper = styled.div`
  width: 100%;
`

function getNodeComponent(node: IndexNode) {
  switch (node.nodeType) {
    case 'folder':
      if (node.isRoot) {
        return RootFolderNode
      } else {
        return FolderNode
      }
    case 'file':
      return BlueprintNode
    case 'datasource':
      return DataSourceNode
    default:
      return () => <div>{node.title}</div>
  }
}

export default () => {
  const [state, dispatch] = useReducer(BlueprintReducer, initialState)

  //not use useFetch hook because response should be dispatched to the reducer.
  useEffect(() => {
    //avoid unnecessary fetch.
    if (!state.dataSources.length) {
      axios(api.dataSourcesGet(DataSourceType.Blueprints))
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
      <Header>
        <div />
        <AddDatasource documentType={DocumentType.BLUEPRINTS} />
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
