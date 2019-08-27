import React from 'react'
import { BlueprintAction, BlueprintState } from '../BlueprintReducer'
import Header from '../../../components/Header'
import FileUpload from './FileUpload'
import { Col, Grid, Row } from 'react-styled-flexboxgrid'
import AddDatasource from './AddDatasource'

type Props = {
  state: BlueprintState
  dispatch: (action: BlueprintAction) => void
}

export default (props: Props) => {
  const { state, dispatch } = props

  return (
    <Grid fluid>
      <Row
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}
      >
        <Col style={{ display: 'inline-flex', marginBottom: 20 }}>
          {false && <FileUpload state={state} dispatch={dispatch} />}
        </Col>

        <Col style={{ display: 'inline-flex', marginBottom: 20 }}>
          <AddDatasource {...props} />
        </Col>
      </Row>
      <Header>
        <h3>Blueprints</h3>
      </Header>
    </Grid>
  )
}
