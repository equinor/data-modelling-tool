import React, { useEffect, useReducer, useState } from 'react'
import { Col, Grid, Row } from 'react-styled-flexboxgrid'
import styled from 'styled-components'
import BlueprintReducer, {
  DocumentActions,
  initialState,
} from '../common/DocumentsReducer'
import { Datasource, DataSourceType, DmtApi, IndexNode } from '../../api/Api'
import axios from 'axios'
import { FolderNode } from './nodes/FolderNode'
import { BlueprintNode } from './nodes/BlueprintNode'
import DocumentTree from '../common/tree-view/DocumentTree'
import { TreeNodeData } from '../../components/tree-view/Tree'
import { RootFolderNode } from './nodes/RootFolderNode'
import FileUpload from '../common/tree-view/FileUpload'
import Header from '../../components/Header'
import AddDatasource from '../common/tree-view/AddDatasource'
import { H5 } from '../../components/Headers'

const api = new DmtApi()

const Wrapper = styled.div`
  width: 100%;
  margin-top: 20px;
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
    default:
      return () => <div>{node.title}</div>
  }
}

export default (props: any) => {
  const { layout } = props
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
        <AddDatasource />
      </Header>
      {state.dataSources.map((ds: Datasource) => (
        <div key={ds.id}>
          <Header>
            <H5>{ds.name}</H5>
            <FileUpload state={state} dispatch={dispatch} datasource={ds} />
          </Header>
          <DocumentTree
            onNodeSelect={(node: TreeNodeData) => {
              /*dispatch(
                DocumentActions.setSelectedDocumentId(node.nodeId, ds.id)
              )*/
            }}
            state={state}
            datasource={ds}
            dispatch={dispatch}
            getNodeComponent={getNodeComponent}
            layout={layout}
          />
        </div>
      ))}
    </Wrapper>
  )
}
