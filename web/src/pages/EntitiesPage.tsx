import React, { useEffect, useReducer } from 'react'
import DocumentTree from './common/tree-view/DocumentTree'
import EntitiesReducer, {
  DocumentActions,
  initialState,
} from './common/DocumentsReducer'
import Header from '../components/Header'
import { Wrapper } from './BlueprintsPage'
import { DocumentNode } from './common/nodes/DocumentNode'
import { TreeNodeRenderProps } from '../components/tree-view/TreeNode'
import { Application } from '../util/variables'
import DocumentEditorPage from './common/DocumentEditorWrapper'
import AddDatasource from './common/tree-view/AddDatasource'
import { DataSourceAPI } from '../api/Api3'

export default () => {
  const [state, dispatch] = useReducer(EntitiesReducer, initialState)
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
          application={Application.ENTITIES}
        />
      </Wrapper>
    </DocumentEditorPage>
  )
}
