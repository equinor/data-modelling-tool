import React from 'react'
import { PageMode } from '../BlueprintPage'
import Button from '../../../components/Button'
import useFetch from '../../../components/useFetch'

interface Props {
  selectedBlueprintId: string
  setPageMode: (mode: PageMode) => void
}

export default (props: Props) => {
  const { selectedBlueprintId, setPageMode } = props
  const isDisabled = selectedBlueprintId === ''
  const [loading, data] = useFetch('/api/blueprints/' + selectedBlueprintId)
  if (loading) {
    return <div>Loading...</div>
  }

  console.log(data)
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'inline-flex' }}>View mode</div>
        <div style={{ display: 'inline-flex' }}>
          <Button
            disabled={isDisabled}
            onClick={() => setPageMode(PageMode.edit)}
          >
            Edit
          </Button>
        </div>
      </div>
      <pre>{Object.keys(data).length > 0 && JSON.stringify(data, null, 2)}</pre>
    </>
  )
}
