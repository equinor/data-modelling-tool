import React, { useEffect, useReducer } from 'react'
import DocumentTree from './common/tree-view/DocumentTree'
import EntitiesReducer, {
  DocumentActions,
  initialState,
} from './common/DocumentsReducer'
import { DmtApi } from '../api/Api'
import axios from 'axios'
import Header from '../components/Header'
import { Wrapper } from './BlueprintsPage'
import { DocumentNode } from './common/nodes/DocumentNode'
import { TreeNodeRenderProps } from '../components/tree-view/TreeNode'
import { Application, NodeType } from '../util/variables'
import DocumentEditorPage from './common/DocumentEditorWrapper'
import AddDatasource from './common/tree-view/AddDatasource'

const api = new DmtApi()

export default () => {
  const [state, dispatch] = useReducer(EntitiesReducer, initialState)
  //not use useFetch hook because response should be dispatched to the reducer.
  useEffect(() => {
    //avoid unnecessary fetch.
    if (!state.dataSources.length) {
      axios(api.dataSourcesGet())
        .then((res: any) => {
          dispatch(DocumentActions.addDatasources(res.data))
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
            //use components directly to control props better.
            switch (renderProps.nodeData.nodeType) {
              case NodeType.DOCUMENT_NODE:
                return <DocumentNode node={renderProps} />
              default:
                return (props: TreeNodeRenderProps) => (
                  <div>{props.nodeData.title}</div>
                )
            }
          }}
          dataSources={state.dataSources}
          application={Application.ENTITIES}
        />
      </Wrapper>
    </DocumentEditorPage>
  )
}
