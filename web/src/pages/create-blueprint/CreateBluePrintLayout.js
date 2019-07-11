import React from 'react'
import { Grid, Col, Row } from 'react-styled-flexboxgrid'
import styled from 'styled-components'
import TreeViewExisting from './existing/TreeViewExisting'
// import TreeViewNew from './blueprint/TreeViewNew'
import BlueprintPreview from './preview/BlueprintPreview'
import BlueprintForm from './edit-form/BlueprintForm'

export default props => {
  const { dispatch, state, addAsset, filesDispatch, filesState } = props
  return (
    <Grid style={{ width: '90%' }}>
      <Row>
        <Col xs={12}>
          <h1>Create new blueprint</h1>
        </Col>
        <Col xs={12} md={4}>
          <Wrapper>
            <TreeViewExisting
              dispatch={filesDispatch}
              state={filesState}
              //override dispatch
              addAsset={addAsset}
              onSelect={() => {}}
            />
          </Wrapper>
        </Col>

        {/*<Col xs={12} md={6}>*/}
        {/*<Wrapper>*/}
        {/*<TreeViewNew*/}
        {/*nodes={state.nodes}*/}
        {/*dispatch={dispatch}*/}
        {/*onSelect={onSelect}*/}
        {/*/>*/}
        {/*</Wrapper>*/}
        {/*</Col>*/}
        <Col xs={12} md={4}>
          <Wrapper>
            <BlueprintForm state={state} dispatch={dispatch} />
          </Wrapper>
        </Col>

        <Col xs={12} md={4}>
          <Wrapper>
            <BlueprintPreview state={state} filesDispatch={filesDispatch} />
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
