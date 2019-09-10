import React, { useEffect, useReducer } from 'react'
import { Grid, Col, Row } from 'react-styled-flexboxgrid'
import styled from 'styled-components'
//@ts-ignore
import DocumentTree from '../common/tree-view/DocumentTree'
import EntitiesReducer, {
  DocumentActions,
  initialState,
  // PageMode,
} from '../common/DocumentReducer'
import { DataSourceType, DmtApi, IndexNode } from '../../api/Api'
import axios from 'axios'
import { EntityNode } from './nodes/EntityNode'
import { FolderNode } from './nodes/FolderNode'
import { RootFolderNode } from './nodes/RootFolderNode'
import BlueprintPicker from './BlueprintPicker'

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
      return EntityNode
    default:
      return () => <div>{node.title}</div>
  }
}

export default () => {
  const [state, dispatch] = useReducer(EntitiesReducer, initialState)
  // const pageMode = state.pageMode

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
    <Grid fluid>
      <Row>
        <Col xs={12} md={12} lg={5}>
          <Wrapper>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ display: 'inline-flex' }}>
                <BlueprintPicker state={state} dispatch={dispatch} />
              </div>
              <div style={{ display: 'inline-flex' }}></div>
            </div>
            {state.dataSources.map((ds: any) => {
              return (
                <span key={ds._id}>
                  <DocumentTree
                    onNodeSelect={node => {
                      console.log(node)
                    }}
                    state={state}
                    datasource={ds}
                    dispatch={dispatch}
                    getNodeComponent={getNodeComponent}
                  />
                </span>
              )
            })}
          </Wrapper>
        </Col>

        <Col xs={12} md={12} lg={7}>
          <Wrapper></Wrapper>
        </Col>
      </Row>
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
