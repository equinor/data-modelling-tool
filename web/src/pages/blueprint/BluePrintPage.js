import React, { useReducer, useState } from 'react'
import { Grid, Col, Row } from 'react-styled-flexboxgrid'
import styled from 'styled-components'
import TreeViewExisting from './tree-view/BluePrintTreeView'
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
  const [selectedTemplateId, setSelectedTemplateId] = useState('')
  const [previewData, setPreviewData] = useState(null)
  const [editMode, setEditMode] = useState(false)

  return (
    <Grid style={{ width: '90%' }}>
      <Row>
        <Col xs={12} md={4}>
          <Wrapper>
            <TreeViewExisting
              dispatch={dispatchTreeView}
              state={stateTreeView}
              setSelectedTemplateId={setSelectedTemplateId}
              setEditMode={setEditMode}
            />
          </Wrapper>
        </Col>

        <Col xs={12} md={4}>
          <Wrapper>
            <BlueprintForm
              state={stateTreeView}
              selectedTemplateId={selectedTemplateId}
              dispatch={dispatchTreeView}
              editMode={editMode}
              onSubmit={path => {
                dispatchTreeView(FilesActions.addFile(path))
              }}
              setPreviewData={setPreviewData}
              formSchema={null}
            />
          </Wrapper>
        </Col>

        <Col xs={12} md={4}>
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
