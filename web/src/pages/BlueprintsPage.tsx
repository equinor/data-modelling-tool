import React, { useEffect, useReducer } from 'react'
import styled from 'styled-components'
import BlueprintReducer, {
  DocumentActions,
  initialState,
} from './common/DocumentsReducer'
import DocumentTree from './common/tree-view/DocumentTree'
import Header from '../components/Header'
import AddDatasource from './common/tree-view/AddDatasource'
import { DocumentNode } from './common/nodes/DocumentNode'
import { TreeNodeRenderProps } from '../components/tree-view/TreeNode'
import { Application } from '../util/variables'
import DocumentEditorPage from './common/DocumentEditorWrapper'
import { DataSourceAPI } from '../api/GenApi'

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
      DataSourceAPI.getAll()
        .then((res: any) => {
          dispatch(DocumentActions.addDatasources(res))
        })
        .catch((e: any) => {
          console.log(e)
        })
    }
  }, [state.dataSources.length])

  return (
    <DocumentEditorPage>
      <Wrapper>
        <Header>
          <div />
          <AddDatasource />
        </Header>
        <br />
        <DocumentTree
          render={(renderProps: TreeNodeRenderProps) => {
            return <DocumentNode node={renderProps} />
          }}
          dataSources={state.dataSources}
          application={Application.BLUEPRINTS}
        />
      </Wrapper>
    </DocumentEditorPage>
  )
}
