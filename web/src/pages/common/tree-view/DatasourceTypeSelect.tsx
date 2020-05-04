import React from 'react'
import { DatasourceOption } from './DatasourceSelect'

type Props = {
  selectedDatasourceType: string
  setSelectedDatasourceType: Function
}

export default (props: Props) => {
  const { selectedDatasourceType, setSelectedDatasourceType } = props
  const datasourceTypeOptions: DatasourceOption[] = [
    { label: '', value: '' },
    { label: 'mongo db', value: 'mongo-db' },
    { label: 'Azure Blob Storage', value: 'azure-blob-storage' },
  ]
  return (
    <select
      value={selectedDatasourceType}
      onChange={e => {
        setSelectedDatasourceType(e.target.value)
      }}
      style={{ margin: '0 10px' }}
    >
      {datasourceTypeOptions.map((option: DatasourceOption) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
