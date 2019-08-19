import React, { useReducer } from 'react'
import { Grid, Col, Row } from 'react-styled-flexboxgrid'
import styled from 'styled-components'
import BlueprintTreeView from './tree-view/BlueprintTreeView'
import EditBlueprintForm from './form/EditBlueprintForm'
import blueprintTreeViewReducer from './tree-view/BlueprintTreeViewReducer'
import CreateBlueprintForm from './form/CreateBlueprintForm'
import ViewBlueprintForm from './form/ViewBlueprintForm'
import BlueprintReducer, {
  blueprintInitialState,
  PageMode,
} from './BlueprintReducer'

export default () => {
  const [stateTreeView, dispatchTreeView] = useReducer(
    blueprintTreeViewReducer,
    {}
  )
  const [state, dispatch] = useReducer(BlueprintReducer, blueprintInitialState)
  const pageMode = state.pageMode
  return (
    <Grid fluid>
      <Row>
        <Col xs={12} md={12} lg={5}>
          <Wrapper>
            <BlueprintTreeView
              dispatchTreeview={dispatchTreeView}
              stateTreeview={stateTreeView}
              state={state}
              dispatch={dispatch}
            />
          </Wrapper>
        </Col>

        <Col xs={12} md={12} lg={7}>
          <Wrapper>
            {pageMode === PageMode.view && (
              <ViewBlueprintForm state={state} dispatch={dispatch} />
            )}
            {pageMode === PageMode.edit && <EditBlueprintForm state={state} />}

            {pageMode === PageMode.create && (
              <CreateBlueprintForm
                dispatchTreeview={dispatchTreeView}
                state={state}
              />
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
