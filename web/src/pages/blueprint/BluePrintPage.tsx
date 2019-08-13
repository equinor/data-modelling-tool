import React, { useReducer, useState } from 'react'
import { Grid, Col, Row } from 'react-styled-flexboxgrid'
import styled from 'styled-components'
import BluePrintTreeView from './tree-view/BluePrintTreeView'
import BlueprintPreview from './preview/BluePrintPreview'
import BlueprintForm from './form/BluePrintForm'
import treeViewExistingReducer, {
  FilesActions,
} from './tree-view/BluePrintTreeViewReducer'

export default () => {
  const [stateTreeView, dispatchTreeView] = useReducer(
    treeViewExistingReducer,
    {}
  )
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null
  )
  const [previewData, setPreviewData] = useState(null)
  const [editMode, setEditMode] = useState(false)

  return (
    <Grid fluid>
      <Row>
        <Col xs={12} md={4} lg={4}>
          <Wrapper>
            <BluePrintTreeView
              dispatch={dispatchTreeView}
              state={stateTreeView}
              setSelectedTemplateId={setSelectedTemplateId}
              setEditMode={setEditMode}
            />
          </Wrapper>
        </Col>

        <Col xs={12} md={4} lg={4}>
          <Wrapper>
            <BlueprintForm
              state={stateTreeView}
              dispatch={dispatchTreeView}
              selectedTemplateId={selectedTemplateId}
              editMode={editMode}
              setPreviewData={setPreviewData}
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
