import React from 'react'
import Button from '../../../components/Button'
import useFetch from '../../../components/useFetch'
import styled from 'styled-components'
import {
  BlueprintAction,
  BlueprintActions,
  BlueprintState,
  PageMode,
} from '../BlueprintReducer'

interface Props {
  state: BlueprintState
  dispatch: (action: BlueprintAction) => void
}

export default (props: Props) => {
  const {
    state: { selectedBlueprintId, dataUrl },
    dispatch,
  } = props
  const isDisabled = selectedBlueprintId === ''
  const [loading, data] = useFetch(dataUrl)
  const [loadingTemplate, dataTemplate] = useFetch(
    '/api/templates/blueprint.json'
  )
  if (loading || loadingTemplate) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'inline-flex' }}>View mode</div>
        <div style={{ display: 'inline-flex' }}>
          <Button
            disabled={isDisabled}
            onClick={() =>
              dispatch(BlueprintActions.setPageMode(PageMode.edit))
            }
          >
            Edit
          </Button>
        </div>
      </div>
      <div style={{ margin: 20 }}>
        <ViewData
          data={data}
          dataTemplate={dataTemplate}
          disabled={isDisabled}
        />
      </div>
    </>
  )
}

const ViewData = (props: any) => {
  const { disabled, dataTemplate, data } = props
  if (disabled || Object.keys(data).length === 0) {
    return null
  }
  let components = dataTemplate.view.map((config: any, index: number) => {
    const key = 'view' + index
    switch (config.display) {
      case 'basic':
        return <BasicView key={key} config={config} data={data} />
      case 'table':
        return <TableView key={key} config={config} data={data} />
      default:
        return <div key={key}>{config.display}</div>
    }
  })
  // if (!components) {
  // 		components = <pre>{Object.keys(dataTemplate).length > 0 && JSON.stringify(dataTemplate.view, null, 2)}</pre>
  // }
  return <>{components}</>
}

const BasicView = (props: any) => {
  const { config, data } = props
  return (
    <div>
      {config.keys.map((key: string) => {
        const value = data[key]
        return (
          <div style={{ margin: '10px 0' }} key={key}>
            <span style={{ fontWeight: 'bold' }}>{key}</span>: {value}
          </div>
        )
      })}
    </div>
  )
}

const Table = styled.table`
  border: 1px solid;
`

const Tr = styled.tr`
  border-bottom: 1px solid;
`

const Th = styled.th`
  padding: 10px;
`

const Td = styled.td`
  padding: 5px 10px;
`

const TableView = (props: any) => {
  const { config, data } = props
  try {
    let items = data
    let rows = []

    if (config.keys.indexOf('.')) {
      config.keys.split('.').forEach((key: string) => {
        if (items && items[key]) {
          items = items[key]
        }
      })
      rows = items.map((item: any, index: number) => {
        const tds = config.rowValues.map((rowValue: string, index: number) => {
          return <Td key={'td' + index}>{item[rowValue]}</Td>
        })
        return <Tr key={'row' + index}>{tds}</Tr>
      })
    }

    const headerCells = config.rowHeader.map((label: string, index: number) => (
      <Th key={label + index}>{label}</Th>
    ))

    return (
      <Table>
        <thead>
          <Tr>{headerCells}</Tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    )
  } catch (e) {
    return (
      <pre>
        {Object.keys(data).length > 0 && JSON.stringify(config.view, null, 2)}
      </pre>
    )
  }
}
