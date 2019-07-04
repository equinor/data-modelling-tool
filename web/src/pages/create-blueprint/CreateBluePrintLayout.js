import React from 'react'
import { Grid, Col, Row } from 'react-styled-flexboxgrid'
import styled from 'styled-components'
import TreeViewExisting from './TreeViewExisting'
import TreeViewNew from './TreeViewNew'
import BlueprintPreview from './BlueprintPreview'
import BlueprintForm from './BlueprintForm'

export default props => {
  const {
    dataExistingModels,
    dispatchExistingModel,
    dataNewBlueprint,
    dispatchNewBlueprint,
    onSelect,
    selectedTemplate,
  } = props
  return (
    <Grid style={{ width: '90%' }}>
      <Row>
        <Col xs={12}>
          <h1>Create new blueprint</h1>
        </Col>
      </Row>

      <Row>
        <Col xs={12} md={6}>
          <Wrapper>
            <TreeViewExisting
              data={dataExistingModels}
              dispatch={dispatchExistingModel}
              //override dispatch
              dispatchAddFile={dispatchNewBlueprint}
            />
          </Wrapper>
        </Col>

        <Col xs={12} md={6}>
          <Wrapper>
            <TreeViewNew
              data={dataNewBlueprint}
              dispatch={dispatchNewBlueprint}
              onSelect={onSelect}
            />
          </Wrapper>
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={6}>
          <Wrapper>
            <BlueprintForm
              state={dataNewBlueprint}
              dispatch={dispatchNewBlueprint}
              selectedTemplate={selectedTemplate}
            />
          </Wrapper>
        </Col>

        <Col xs={12} md={6}>
          <Wrapper>
            <BlueprintPreview state={dataNewBlueprint} />
          </Wrapper>
        </Col>
      </Row>
    </Grid>
  )
}

const Wrapper = styled.div`
  width: 100%;
  min-height: 300px;
  border: 1px solid;
  margin: 15px 10px;
  padding: 10px;
`
