//import ReactDOM from 'react-dom';

import { useTable } from 'react-table'
import styled from 'styled-components'

/* ********************************************************* */
//Custom views
/* ********************************************************* */

const TableStyles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;
    border-bottom: 25px;
    padding-bottom: 100px;

    tr {
      :last-child {
        td {
          border-bottom: 1;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`
/* ********************************************************* */
/* ********************************************************* */
function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  })

  // Render the UI for your table
  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

const SMTable = (sm) => {
  var headers = [
    'Mass[kg^3]',
    'Ixx[kg^3 m^2]',
    'Iyx[kg^3 m^2]',
    'Iyy[kg^3 m^2]',
    'Izx[kg^3 m^2]',
    'Izy[kg^3 m^2]',
    'Izz[kg^3 m^2]',
  ]
  var items = ['mass', 'ixx', 'iyx', 'iyy', 'izx', 'izy', 'izz']

  var columns = []
  var data = []
  var row = {}
  for (var i = 0; i < headers.length; i++) {
    var acc = 'col_' + i
    columns.push({
      Header: headers[i],
      accessor: acc,
    })

    row[acc] = (sm[items[i]] / 1000).toExponential(3)
  }
  data.push(row)

  return { columns, data }
}

const P3Table = (point3) => {
  var headers = ['X[m]', 'Y[m]', 'Z[m]']
  var items = ['x', 'y', 'z']

  var columns = []
  var data = []
  var row = {}
  for (var i = 0; i < headers.length; i++) {
    var acc = 'col_' + i
    columns.push({
      Header: headers[i],
      accessor: acc,
    })

    row[acc] = point3[items[i]]
  }
  data.push(row)

  return { columns, data }
}

const SIMA_Model_StructuralMass = ({ document }) => {
  let tabData
  tabData = SMTable(document)

  let tabDataP3
  tabDataP3 = P3Table(document.COG)
  return (
    <TableStyles>
      {
        <div className="container">
          "COG"
          <Table columns={tabDataP3.columns} data={tabDataP3.data} />
          "Mass"
          <Table columns={tabData.columns} data={tabData.data} />
        </div>
      }
    </TableStyles>
  )
}
export { SIMA_Model_StructuralMass }
