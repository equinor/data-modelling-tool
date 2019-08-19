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

type Props = {
  state: BlueprintState
  dispatch: (action: BlueprintAction) => void
  onCreatePackage: () => void
}

export default (props: Props) => {
  const { state, dispatch, onCreatePackage } = props
  return (
    <>
      <div style={{ width: '100%', textAlign: 'right' }}>
        <span> Datasource:</span>
        <select
          onChange={e => {
            console.log(e.target.value)
            const selectedDatasourceId = Number(e.target.value)
            dispatch(
              BlueprintActions.setSelectedDatasourceId(selectedDatasourceId)
            )
          }}
          style={{ margin: '0 10px' }}
        >
          {state.datasources.map((datasource: Datasource) => (
            <option key={datasource.id} value={datasource.id}>
              {datasource.label}
            </option>
          ))}
        </select>
        <FaPlus />
      </div>
      <Header>
        <h3>Blueprints</h3>
        <Button type="button" onClick={onCreatePackage}>
          Create Package
        </Button>
      </Header>
    </>
  )
}
