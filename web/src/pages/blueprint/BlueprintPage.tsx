import React, { useReducer, useState } from 'react'
import { Grid, Col, Row } from 'react-styled-flexboxgrid'
import styled from 'styled-components'
import BlueprintTreeView from './tree-view/BlueprintTreeView'
import BlueprintPreview from './preview/BlueprintPreview'
import { EditBlueprintForm, CreateBlueprintForm } from './form/BlueprintForm'
import blueprintTreeViewReducer, {
  BlueprintTreeViewActions,
} from './tree-view/BlueprintTreeViewReducer'

export default () => {
  const [stateTreeView, dispatchTreeView] = useReducer(
    blueprintTreeViewReducer,
    {}
  )
  const [selectedBlueprintId, setSelectedBlueprintId] = useState<string | null>(
    null
  )
  // const [previewData, setPreviewData] = useState(null)
  const [editMode, setEditMode] = useState<boolean | null>(false)

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
            {editMode ? (
              <EditBlueprintForm
                dispatch={dispatchTreeView}
                selectedBlueprintId={selectedBlueprintId}
              />
            ) : (
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
