import React, { MouseEventHandler } from 'react'
import { Table } from '@equinor/eds-core-react'

type TColumn = { name: string; accessor: string }

const prepareColumns = (columns: Array<string>): Array<TColumn> => {
  const prepared: Array<TColumn> = []
  columns.forEach((col) => {
    prepared.push({ name: col, accessor: col.replace(/ /g, '') })
  })

  return prepared
}

export const DynamicTable = (props: {
  columns: Array<string>
  rows: Array<any>
  onRowClicked?: MouseEventHandler
}): JSX.Element => {
  const { columns, rows } = props
  const onRowClicked = props.onRowClicked
    ? props.onRowClicked
    : (event: any) => (document.location = event.target.parentElement.accessKey)
  const cols = prepareColumns(columns)
  const ignoredRows = ['_id', 'index', 'url']

  return (
    <>
      <Table style={{ width: '100%' }}>
        <Table.Head sticky>
          <Table.Row>
            {cols.map((col) => (
              <Table.Cell key={`head-${col.accessor}`}>{col.name}</Table.Cell>
            ))}
          </Table.Row>
        </Table.Head>
        <Table.Body onClick={onRowClicked} style={{ cursor: 'pointer' }}>
          {rows?.map((row, index) => (
            <Table.Row
              key={row._id}
              id={row._id}
              tabIndex={row.index || index}
              accessKey={row.url || row._id}
            >
              {Object.keys(row)
                .filter((key) => !ignoredRows.includes(key))
                .map((attrKey: string) => (
                  <Table.Cell key={attrKey}>{row[attrKey]}</Table.Cell>
                ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  )
}
