import React from 'react'
import {
  BlueprintAction,
  BlueprintActions,
  BlueprintState,
  Datasource,
} from '../BlueprintReducer'
import { FaPlus } from 'react-icons/fa'
import Button from '../../../components/Button'
import Header from '../../../components/Header'
import FileUpload from './FileUpload'
import { Col, Grid, Row } from 'react-styled-flexboxgrid'

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
          {state.selectedDatasourceId === 2 && (
            <FileUpload state={state} dispatch={dispatch} />
          )}
        </Col>

        <Col style={{ display: 'inline-flex', marginBottom: 20 }}>
          <div>
            <div style={{ fontWeight: 700, marginLeft: 10, marginBottom: 10 }}>
              {' '}
              Datasource:
            </div>
            <select
              onChange={e => {
                const selectedDatasourceId = Number(e.target.value)
                dispatch(
                  BlueprintActions.setSelectedDatasourceId(selectedDatasourceId)
                )
              }}
              style={{ margin: '0 10px' }}
            >
              {state.datasources.map((datasource: Datasource) => (
                <option key={datasource.id} value={datasource.id}>
                  {datasource.name}
                </option>
              ))}
            </select>
            <FaPlus onClick={() => {}} />
          </div>
        </Col>
      </Row>
      <Header>
        <h3>Blueprints</h3>
        <Button type="button" disabled={true} onClick={() => {}}>
          Create Package
        </Button>
      </Header>
    </Grid>
  )
}
