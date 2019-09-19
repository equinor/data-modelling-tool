import React, { useEffect, useReducer } from 'react'
import styled from 'styled-components'
import BlueprintReducer, {
  DocumentActions,
  initialState,
} from '../common/DocumentsReducer'
import { DataSourceType, DmtApi } from '../../api/Api'
import axios from 'axios'
import { FolderNode } from './nodes/FolderNode'
import DocumentTree, { RenderProps } from '../common/tree-view/DocumentTree'
import { RootFolderNode } from './nodes/RootFolderNode'
import Header from '../../components/Header'
import AddDatasource from '../common/tree-view/AddDatasource'
import { DataSourceNode } from './nodes/DataSourceNode'
import { DocumentType } from '../../util/variables'
import { NodeType } from '../../api/types'
import { EntityNode } from '../entities/nodes/EntityNode'

const api = new DmtApi()

export const Wrapper = styled.div`
  width: 100%;
`

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
        render={(renderProps: RenderProps) => {
          //use components directly to control props better.
          switch (renderProps.treeNodeData.nodeType) {
            case NodeType.folder: {
              const meta: object = renderProps.treeNodeData['meta']
              console.log(meta)
              let documentType = ''
              if (meta.hasOwnProperty('documentType')) {
                documentType = meta['documentType']
              }
              if (documentType == NodeType.rootPackage) {
                return <RootFolderNode {...renderProps} />
              } else if (documentType == NodeType.subPackage) {
                return <FolderNode {...renderProps} />
              } else if (documentType == NodeType.datasource) {
                return <DataSourceNode {...renderProps} state={state} />
              } else {
                return <div>Not found document type</div>
              }
            }
            case NodeType.file:
              return <EntityNode {...renderProps} />
            default:
              return (props: RenderProps) => (
                <div>{props.treeNodeData.title}</div>
              )
          }
        }}
        dataSources={state.dataSources}
      />
    </Wrapper>
  )
}
