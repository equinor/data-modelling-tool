import React from 'react'
import { DataSource } from '@dmt/common'

export type DatasourceOption = {
  label: string
  value: string
}

type Props = {
  selectedDatasource: string
  setSelectedDatasource: (value: string) => void
  datasources: DataSource[]
}

const defaultDatasources: DatasourceOption[] = [
  {
    value: '',
    label: '',
  },
]

export default (props: Props) => {
  const { selectedDatasource, setSelectedDatasource, datasources } = props
  const datasourceOptions = defaultDatasources.concat(
    datasources.map((ds: DataSource) => ({
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
      {datasourceOptions.map((option: DatasourceOption) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
