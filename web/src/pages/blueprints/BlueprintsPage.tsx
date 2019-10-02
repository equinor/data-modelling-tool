import React, { useEffect, useReducer } from 'react'
import styled from 'styled-components'
import BlueprintReducer, {
  DocumentActions,
  initialState,
} from '../common/DocumentsReducer'
import { DataSourceType, DmtApi } from '../../api/Api'
import axios from 'axios'
import { SubPackageNode } from './nodes/SubPackageNode'
import DocumentTree, { RenderProps } from '../common/tree-view/DocumentTree'
import { RootFolderNode } from './nodes/RootFolderNode'
import Header from '../../components/Header'
import AddDatasource from '../common/tree-view/AddDatasource'
import { DataSourceNode } from './nodes/DataSourceNode'
import { DocumentType } from '../../util/variables'
import { NodeType } from '../../api/types'
import { BlueprintNode } from './nodes/BlueprintNode'
import { ArrayPlaceholderNode } from '../common/nodes/ArrayPlaceholderNode'
import { DocumentRefNode } from '../entities/nodes/DocumentRefNode'

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
            case NodeType.ARRAY_PLACEHOLDER:
              return <ArrayPlaceholderNode {...renderProps} />
            case NodeType.version:
            case NodeType.rootPackage:
              return <RootFolderNode {...renderProps} />
            case NodeType.subPackage:
            case NodeType.folder:
              return <SubPackageNode {...renderProps} />
            case NodeType.entityFile:
            case NodeType.file:
              return <BlueprintNode {...renderProps} />
            case NodeType.datasource:
              return <DataSourceNode {...renderProps} state={state} />
            case NodeType.documentRef:
              return <DocumentRefNode {...renderProps} />
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
