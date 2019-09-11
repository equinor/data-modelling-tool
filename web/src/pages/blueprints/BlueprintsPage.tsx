import React, { useEffect, useReducer, useState } from 'react'
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
import GoldenLayoutWrapper from './GoldenLayoutWrapper'
import { GoldenLayoutComponent } from './GoldenLayoutComponent'
import { MyGoldenPanel } from './MyGoldenPanel'
import BlueprintDetail from './BlueprintDetail'

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

function wrapComponent(Component: any, state: any) {
  class Wrapped extends React.Component {
    render() {
      return <Component {...this.props} state={state} />
    }
  }
  return Wrapped
}

export default () => {
  const [state, dispatch] = useReducer(BlueprintReducer, initialState)
  const [layout, setLayout] = useState({ myLayout: null })

  const pageMode = state.pageMode

  console.log(pageMode)

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
        <Col xs={12} md={12} lg={3}>
          <div>
            <Header>
              <div />
              <AddDatasource />
            </Header>
            {state.dataSources.map((ds: Datasource) => (
              <div key={ds.id}>
                <Header>
                  <H5>{ds.name}</H5>
                  <FileUpload
                    state={state}
                    dispatch={dispatch}
                    datasource={ds}
                  />
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
                  layout={layout}
                />
              </div>
            ))}
          </div>
        </Col>

        <Col xs={12} md={12} lg={9}>
          <Wrapper>
            <GoldenLayoutComponent //config from simple react example: https://golden-layout.com/examples/#qZXEyv
              globalState={state}
              htmlAttrs={{ style: { height: '100vh' } }}
              config={{
                content: [
                  {
                    type: 'stack',
                    content: [
                      {
                        title: 'A react component',
                        type: 'react-component',
                        component: 'testItem',
                        props: { value: "I'm on the left" },
                      },
                      {
                        title: 'Another react component',
                        type: 'react-component',
                        component: 'testItem',
                      },
                      {
                        title: 'Blueprint',
                        type: 'react-component',
                        component: 'blueprintItem',
                        props: {
                          state: state,
                        },
                      },
                    ],
                  },
                ],
              }}
              registerComponents={(myLayout: any) => {
                setLayout({ myLayout })
                myLayout.registerComponent('testItem', MyGoldenPanel)
                myLayout.registerComponent(
                  'blueprintItem',
                  wrapComponent(BlueprintDetail, state)
                )
              }}
            />
          </Wrapper>
        </Col>
      </Row>
    </Grid>
  )
}

const Wrapper = styled.div`
  border: 3px solid;
  margin: 15px 10px;
  // padding: 10px;
  border-radius: 5px;
`
