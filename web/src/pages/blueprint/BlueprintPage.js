import React, { useReducer, useState } from 'react'
import { Grid, Col, Row } from 'react-styled-flexboxgrid'
import styled from 'styled-components'
import BlueprintTreeView from './tree-view/BlueprintTreeView'
import BlueprintPreview from './preview/BluePrintPreview'
import BlueprintForm from './form/BluePrintForm'
// @ts-ignore
import treeViewBlueprintReducer, {
  BlueprintTreeViewActions,
} from './tree-view/BlueprintTreeViewReducer'

export default () => {
  const [stateTreeView, dispatchTreeView] = useReducer(
    treeViewBlueprintReducer,
    {}
  )
  const [selectedBlueprintId, setSelectedBlueprintId] = useState('')
  const [previewData, setPreviewData] = useState(null)
  const [editMode, setEditMode] = useState(false)

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

        <Col xs={12} md={4} lg={4}>
          <Wrapper>
            <BlueprintForm
              state={stateTreeView}
              selectedBlueprintId={selectedBlueprintId}
              dispatch={dispatchTreeView}
              editMode={editMode}
              onSubmit={(path, title) => {
                if (!editMode) {
                  dispatchTreeView(
                    BlueprintTreeViewActions.addFile(path, title)
                  )
                }
                alert('updated ' + path)
              }}
              setPreviewData={setPreviewData}
              formSchema={null}
            />
          </Wrapper>
        </Col>

        <Col xs={12} md={4} lg={4}>
          <Wrapper>
            <BlueprintPreview data={previewData} />
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
