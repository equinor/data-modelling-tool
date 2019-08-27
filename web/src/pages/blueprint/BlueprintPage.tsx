import React, { useEffect, useReducer } from 'react'
import { Grid, Col, Row } from 'react-styled-flexboxgrid'
import styled from 'styled-components'
//@ts-ignore
import { NotificationContainer } from 'react-notifications'
import BlueprintTreeView from './tree-view/BlueprintTreeView'
import EditBlueprintForm from './form/EditBlueprintForm'
import CreateBlueprintForm from './form/CreateBlueprintForm'
import ViewBlueprintForm from './form/ViewBlueprintForm'
import BlueprintReducer, {
  BlueprintActions,
  blueprintInitialState,
  PageMode,
} from './BlueprintReducer'
import { DmtApi } from '../../api/Api'
import BlueprintTreeviewHeader from './tree-view/BlueprintTreeviewHeader'
import axios from 'axios'
const api = new DmtApi()

export default () => {
  const [state, dispatch] = useReducer(BlueprintReducer, blueprintInitialState)
  const pageMode = state.pageMode

  //not use useFetch hook because response should be dispatched to the reducer.
  useEffect(() => {
    //avoid unnecessary fetch.
    if (!state.datasources.length) {
      axios(api.dataSourcesGet())
        .then((res: any) => {
          dispatch(BlueprintActions.addDatasources(res.data))
        })
        .catch((e: any) => {
          console.log(e)
        })
    }
  }, [state.datasources.length])

  return (
    <Grid fluid>
      <Row>
        <Col xs={12} md={12} lg={5}>
          <Wrapper>
            <NotificationContainer />
            <BlueprintTreeviewHeader state={state} dispatch={dispatch} />
            {state.datasources.map((ds: any) => {
              return (
                <span key={ds._id}>
                  <BlueprintTreeView
                    state={state}
                    datasource={ds}
                    dispatch={dispatch}
                  />
                </span>
              )
            })}
          </Wrapper>
        </Col>

        <Col xs={12} md={12} lg={7}>
          <Wrapper>
            {pageMode === PageMode.view && (
              <ViewBlueprintForm state={state} dispatch={dispatch} />
            )}
            {pageMode === PageMode.edit && (
              <EditBlueprintForm state={state} dispatch={dispatch} />
            )}

            {pageMode === PageMode.create && (
              <CreateBlueprintForm dispatch={dispatch} state={state} />
            )}
          </Wrapper>
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
