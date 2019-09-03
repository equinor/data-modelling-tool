import React, { useEffect, useReducer } from 'react'
import { Col, Grid, Row } from 'react-styled-flexboxgrid'
import styled from 'styled-components'
//@ts-ignore
import EditBlueprintForm from './blueprint/EditBlueprintForm'
import CreateBlueprintForm from './blueprint/CreateBlueprintForm'
import ViewBlueprintForm from './blueprint/ViewBlueprintForm'
import BlueprintReducer, {
  DocumentActions,
  initialState,
  PageMode,
} from '../common/DocumentReducer'
import { Datasource, DataSourceType, DmtApi, IndexNode } from '../../api/Api'
import Header from './Header'
import axios from 'axios'
import { RootFolderNode } from './nodes/DataSourceNode'
import { FolderNode } from './nodes/FolderNode'
import { BlueprintNode } from './nodes/BlueprintNode'
import DocumentTree from '../common/tree-view/DocumentTree'
import { TreeNodeData } from '../../components/tree-view/Tree'

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
      return BlueprintNode
    default:
      return () => <div>{node.title}</div>
  }
}

export default () => {
  const [state, dispatch] = useReducer(BlueprintReducer, initialState)
  const pageMode = state.pageMode

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
    <Grid fluid>
      {state.dataSources.map((ds: Datasource) => (
        <Row>
          <Col xs={12} md={12} lg={5}>
            <Wrapper>
              <Header state={state} dispatch={dispatch} />
              <span key={ds.id}>
                <DocumentTree
                  onNodeSelect={(node: TreeNodeData) => {
                    dispatch(DocumentActions.setSelectedDocumentId(node.nodeId))
                  }}
                  state={state}
                  datasource={ds}
                  dispatch={dispatch}
                  getNodeComponent={getNodeComponent}
                />
              </span>
            </Wrapper>
          </Col>

          <Col xs={12} md={12} lg={7}>
            <Wrapper>
              {pageMode === PageMode.view && state.selectedDocumentId && (
                <ViewBlueprintForm
                  state={state}
                  datasource={ds}
                  dispatch={dispatch}
                />
              )}
              {pageMode === PageMode.edit && state.selectedDocumentId && (
                <EditBlueprintForm
                  state={state}
                  datasource={ds}
                  dispatch={dispatch}
                />
              )}

              {pageMode === PageMode.create && state.selectedDocumentId && (
                <CreateBlueprintForm
                  dispatch={dispatch}
                  datasource={ds}
                  state={state}
                />
              )}
            </Wrapper>
          </Col>
        </Row>
      ))}
    </Grid>
  )
}

const Wrapper = styled.div`
  width: 100%;
  min-height: 600px;
  border: 1px solid;
  margin: 15px 10px;
  padding: 20px;
  border-radius: 5px;
`
