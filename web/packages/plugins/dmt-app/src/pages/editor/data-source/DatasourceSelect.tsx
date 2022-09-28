import React from 'react'
import { TDataSource } from '@development-framework/dm-core'

export type TDatasourceOption = {
  label: string
  value: string
}

type Props = {
  selectedDatasource: string
  setSelectedDatasource: (value: string) => void
  datasources: TDataSource[]
}

const defaultDatasources: TDatasourceOption[] = [
  {
    value: '',
    label: '',
  },
]

export default (props: Props) => {
  const { selectedDatasource, setSelectedDatasource, datasources } = props
  const datasourceOptions = defaultDatasources.concat(
    datasources.map((ds: TDataSource) => ({
      value: ds.id,
      label: ds.name,
    }))
  )
  return (
    <select
      value={selectedDatasource}
      onChange={(e) => {
        setSelectedDatasource(e.target.value)
      }}
      style={{ margin: '0 10px' }}
    >
      {datasourceOptions.map((option: TDatasourceOption) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
