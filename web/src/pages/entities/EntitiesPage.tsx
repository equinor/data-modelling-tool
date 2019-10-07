import React, { useEffect, useReducer } from 'react'
import DocumentTree, { RenderProps } from '../common/tree-view/DocumentTree'
import EntitiesReducer, {
  DocumentActions,
  initialState,
} from '../common/DocumentsReducer'
import { DataSourceType, DmtApi } from '../../api/Api'
import axios from 'axios'
import Header from '../../components/Header'
import { Wrapper } from '../blueprints/BlueprintsPage'
import Button from '../../components/Button'

const api = new DmtApi()

export default () => {
  const [state, dispatch] = useReducer(EntitiesReducer, initialState)
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
      </Header>
      <br />
      <DocumentTree
        render={(renderProps: RenderProps) => {
          switch (renderProps.treeNodeData.nodeType) {
            default:
              return <div>{renderProps.treeNodeData.title}</div>
          }
        }}
        dataSources={state.dataSources}
      />
    </Wrapper>
  )
}
