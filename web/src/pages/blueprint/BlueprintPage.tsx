import React, { useReducer, useState } from 'react'
import { Grid, Col, Row } from 'react-styled-flexboxgrid'
import styled from 'styled-components'
import BlueprintTreeView from './tree-view/BlueprintTreeView'
import EditBlueprintForm from './form/EditBlueprintForm'
import blueprintTreeViewReducer from './tree-view/BlueprintTreeViewReducer'
import CreateBlueprintForm from './form/CreateBlueprintForm'

export enum PageMode {
  create,
  edit,
  view,
}

export default () => {
  const [stateTreeView, dispatchTreeView] = useReducer(
    blueprintTreeViewReducer,
    {}
  )
  const [selectedBlueprintId, setSelectedBlueprintId] = useState<string>('')
  const [editMode, setEditMode] = useState<PageMode>(PageMode.view)

  return (
    <Grid fluid>
      <Row>
        <Col xs={12} md={4} lg={4}>
          <Wrapper>
            <BlueprintTreeView
              dispatch={dispatchTreeView}
              state={stateTreeView}
              setSelectedBlueprintId={setSelectedBlueprintId}
              setEditMode={setEditMode}
            />
          </Wrapper>
        </Col>

        <Col xs={12} md={8} lg={8}>
          <Wrapper>
            {editMode === PageMode.view && (
              <div>
                View mode
                {selectedBlueprintId && (
                  <button onClick={() => setEditMode(PageMode.edit)}>
                    Edit
                  </button>
                )}
              </div>
            )}
            {editMode === PageMode.edit && (
              <EditBlueprintForm selectedBlueprintId={selectedBlueprintId} />
            )}

            {editMode === PageMode.create && (
              <CreateBlueprintForm
                dispatch={dispatchTreeView}
                selectedBlueprintId={selectedBlueprintId}
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
  padding: 10px;
`
