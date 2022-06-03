/**
 * Work space for attaching plugin to the dmt tool.
 * External dependencies:
 * - option1: should either be provided by the DMT (in package.json)
 * - option2: create a lib folder and add transpiled javascript files. Similar to dist folders in node_modules.
 *
 * External plugins must have a unique name, not conflicting with the DMT official plugin names.
 */

/**
 * Work space for attaching plugin to the dmt tool.
 * External dependencies:
 * - option1: should either be provided by the DMT (in package.json)
 * - option2: create a lib folder and add transpiled javascript files. Similar to dist folders in node_modules.
 *
 * External plugins must have a unique name, not conflicting with the DMT official plugin names.
 */

import styled from 'styled-components'
import { useTable } from 'react-table'

const Styles = styled.div`
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

const SRSEnvTable = ({ document }) => {
  //console.log(document);
  //console.log(parent);

  var tabs = []
  var columns = []
  var data = []

  columns = [
    {
      Header: 'Wave',
      columns: [
        {
          Header: 'name',
          accessor: 'name',
        },
        {
          Header: 'value',
          accessor: 'value',
        },
        {
          Header: 'description',
          accessor: 'description',
        },
      ],
    },
  ]

  data = []

  var entity = document.wave
  var propNames = ['waveDirection', 'significantWaveHeight', 'peakPeriod']
  var descs = [
    'Wave propagation direction -comming from- in [deg].',
    'Significant wave height in [m].',
    'Peak period in [s].',
  ]
  for (var propi = 0; propi < propNames.length; propi++) {
    var propName = propNames[propi]
    data.push({
      name: propName,
      value: entity[propName],
      description: descs[propi],
    })
  }

  tabs.push({ data, columns })
  //console.log(data);
  //console.log(columns);

  columns = [
    {
      Header: 'Wind',
      columns: [
        {
          Header: 'name',
          accessor: 'name',
        },
        {
          Header: 'value',
          accessor: 'value',
        },
        {
          Header: 'description',
          accessor: 'description',
        },
      ],
    },
  ]

  data = []
  entity = document.wind
  propNames = ['windDirection', 'windVelocity']
  descs = [
    'Wind direction -comming from- in [deg].',
    'Average wind speed 10[m] above mean water surface in [m/s].',
  ]
  for (var propi = 0; propi < propNames.length; propi++) {
    var propName = propNames[propi]
    data.push({
      name: propName,
      value: entity[propName],
      description: descs[propi],
    })
  }

  tabs.push({ data, columns })
  //console.log(data);
  //console.log(columns);

  columns = [
    {
      Header: 'Current',
      columns: [
        {
          Header: 'currentDepths',
          accessor: 'currentDepths',
        },
        {
          Header: 'currentDirections',
          accessor: 'currentDirections',
        },
        {
          Header: 'currentVelocities',
          accessor: 'currentVelocities',
        },
      ],
    },
  ]

  data = []

  entity = document.current
  propNames = ['currentDepths', 'currentDirections', 'currentVelocities']
  descs = [
    'Wave propagation direction -comming from- in [deg].',
    'Significant wave height in [m].',
    'Peak period in [s].',
  ]
  for (var propi = 0; propi < entity.currentDepths.split(',').length; propi++) {
    data.push({
      currentDepths: entity.currentDepths.split(',')[propi],
      currentDirections: entity.currentDirection,
      currentVelocities: entity.currentVelocities.split(',')[propi],
    })
  }

  tabs.push({ data, columns })
  //console.log(data);
  //console.log(columns);

  return (
    <Styles>
      {tabs.map((item, index) => (
        <div className="container" key={index}>
          <Table columns={item.columns} data={item.data} />
        </div>
      ))}
    </Styles>
  )
}

//********************************************************//
//********************************************************//

export { SRSEnvTable }
