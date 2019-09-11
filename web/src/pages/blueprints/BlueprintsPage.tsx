import React, { useEffect, useReducer } from 'react'
import { Col, Grid, Row } from 'react-styled-flexboxgrid'
import styled from 'styled-components'
import EditBlueprintForm from './blueprint/EditBlueprintForm'
import CreateBlueprintForm from './blueprint/CreateBlueprintForm'
import ViewBlueprintForm from './blueprint/ViewBlueprintForm'
import BlueprintReducer, {
  DocumentActions,
  initialState,
  PageMode,
} from '../common/DocumentReducer'
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
      <Row>
        <Col xs={12} md={12} lg={5}>
          <Wrapper>
            <div style={{ marginBottom: 25 }}>
              <Header>
                <div />
                <AddDatasource />
              </Header>
            </div>
            {state.dataSources.map((ds: Datasource) => (
              <div key={ds.id} style={{ marginBottom: 30 }}>
                <Header>
                  <H5>{ds.name}</H5>
                  {ds.type === 'localStorage' && (
                    <FileUpload
                      state={state}
                      dispatch={dispatch}
                      datasource={ds}
                    />
                  )}
                </Header>
                <DocumentTree
                  onNodeSelect={(node: TreeNodeData) => {
                    dispatch(
                      DocumentActions.setSelectedDocumentId(node.nodeId, ds.id)
                    )
                  }}
                  state={state}
                  datasource={ds}
                  dispatch={dispatch}
                  getNodeComponent={getNodeComponent}
                />
              </div>
            ))}
          </Wrapper>
        </Col>

        <Col xs={12} md={12} lg={7}>
          <Wrapper>
            {pageMode === PageMode.view && state.selectedDocumentId && (
              <ViewBlueprintForm state={state} dispatch={dispatch} />
            )}
            {pageMode === PageMode.edit && state.selectedDocumentId && (
              <EditBlueprintForm state={state} dispatch={dispatch} />
            )}

            {pageMode === PageMode.create && state.selectedDocumentId && (
              <CreateBlueprintForm dispatch={dispatch} state={state} />
            )}
          </Wrapper>
        </Col>
      </Row>
    </Grid>
  )
}

const Wrapper = styled.div`
  border: 1px solid;
  margin: 15px 10px;
  padding: 10px;
  border-radius: 5px;
`
