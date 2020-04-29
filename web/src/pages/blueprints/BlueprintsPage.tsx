import React, { useEffect, useReducer } from 'react'
import styled from 'styled-components'
import BlueprintReducer, {
  DocumentActions,
  initialState,
} from '../common/DocumentsReducer'
import { DataSourceType, DmtApi } from '../../api/Api'
import axios from 'axios'
import DocumentTree from '../common/tree-view/DocumentTree'
import Header from '../../components/Header'
import AddDatasource from '../common/tree-view/AddDatasource'
import { DocumentType, NodeType } from '../../util/variables'
import { DocumentNode } from '../common/nodes/DocumentNode'
import { TreeNodeRenderProps } from '../../components/tree-view/TreeNode'

const api = new DmtApi()

export const Wrapper = styled.div`
  width: 100%;
  padding-right: 20px;
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
        render={(renderProps: TreeNodeRenderProps) => {
          return <DocumentNode node={renderProps} />
        }}
        dataSources={state.dataSources}
      />
    </Wrapper>
  )
}
