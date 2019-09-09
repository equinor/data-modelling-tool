import React from 'react'
import { DocumentsAction, DocumentsState } from '../common/DocumentReducer'
import Header from '../../components/Header'
import FileUpload from '../common/tree-view/FileUpload'
import { Col, Grid, Row } from 'react-styled-flexboxgrid'
import AddDatasource from '../common/tree-view/AddDatasource'

type Props = {
  state: DocumentsState
  dispatch: (action: DocumentsAction) => void
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
          <AddDatasource {...props} documentType="entities" />
        </Col>
      </Row>
      <Header>
        <h3>Blueprints</h3>
      </Header>
    </Grid>
  )
}
