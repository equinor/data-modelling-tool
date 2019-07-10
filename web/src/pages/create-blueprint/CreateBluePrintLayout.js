import React from 'react'
import { Grid, Col, Row } from 'react-styled-flexboxgrid'
import styled from 'styled-components'
import TreeViewExisting from './existing/TreeViewExisting'
import TreeViewNew from './blueprint/TreeViewNew'
import BlueprintPreview from './BlueprintPreview'
import BlueprintForm from './BlueprintForm'

export default props => {
  const { dispatch, state, onSelect, addAsset } = props
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
              //override dispatch
              addAsset={addAsset}
            />
          </Wrapper>
        </Col>

        <Col xs={12} md={6}>
          <Wrapper>
            <TreeViewNew
              nodes={state.nodes}
              dispatch={dispatch}
              onSelect={onSelect}
            />
          </Wrapper>
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={6}>
          <Wrapper>
            <BlueprintForm state={state} dispatch={dispatch} />
          </Wrapper>
        </Col>

        <Col xs={12} md={6}>
          <Wrapper>
            <BlueprintPreview state={state} />
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
