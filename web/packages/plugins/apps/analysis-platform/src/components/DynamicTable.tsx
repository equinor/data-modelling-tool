import React from 'react'
import { Table } from '@equinor/eds-core-react'

type Column = { name: string; accessor: string }

const prepareColumns = (columns: Array<string>): Array<Column> => {
  const prepared: Array<Column> = []
  columns.forEach((col) => {
    prepared.push({ name: col, accessor: col.replace(/ /g, '') })
  })

  return prepared
}

const DynamicTable = (props: {
  columns: Array<string>
  rows: Array<any>
  onRowClicked?: Function
}): JSX.Element => {
  const { columns, rows, onRowClicked } = props
  const cols = prepareColumns(columns)

  return (
    <>
      <Table style={{ width: '100%' }} onClick={onRowClicked}>
        <Table.Head sticky>
          <Table.Row>
            {cols.map((col) => (
              <Table.Cell key={`head-${col.accessor}`}>{col.name}</Table.Cell>
            ))}
          </Table.Row>
        </Table.Head>
        <Table.Body style={{ cursor: 'pointer' }}>
          {rows?.map((row) => (
            <Table.Row key={row._id} accessKey={row._id}>
              {Object.keys(row)
                .filter((key) => key !== '_id')
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

export default DynamicTable
