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

//import { VictoryTheme, VictoryChart, VictoryLine, VictoryBar } from 'victory'

//********************************************************//
//********************************************************//
//making tables
//********************************************************//
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

//********************************************************//
//********************************************************//

const BlueprintTable = ({ document }) => {
  //console.log(document);
  //console.log(parent);

  var tabs = []
  var columns = []
  var data = []

  columns = [
    {
      Header: 'Blueprint',
      columns: [
        {
          Header: 'Name',
          accessor: 'name',
        },
        {
          Header: 'Description',
          accessor: 'description',
        },
      ],
    },
  ]

  data = []
  data.push({
    name: document.name,
    description: document.description,
  })

  tabs.push({ data, columns })

  columns = [
    {
      Header: 'Attributes',
      columns: [
        {
          Header: 'Name',
          accessor: 'name',
        },
        {
          Header: 'Type',
          accessor: 'propType',
        },
        {
          Header: 'Dimension',
          accessor: 'dim',
        },
        {
          Header: 'Description',
          accessor: 'description',
        },
      ],
    },
  ]

  data = []

  for (var propi = 0; propi < document.attributes.length; propi++) {
    var prop = document.attributes[propi]
    var dim = 1
    if (prop.dimensions !== undefined) {
      dim = prop.dimensions
    }

    if (prop.name !== 'type') {
      data.push({
        name: prop.name,
        propType: prop.attributeType,
        dim: dim,
        description: prop.description,
      })
    }
  }

  tabs.push({ data, columns })
  //console.log(data);
  //console.log(columns);

  return (
    <span style={{ paddingRight: 20 }}>
      <Styles>
        {tabs.map((item, index) => (
          <div className="container" key={index}>
            <Table columns={item.columns} data={item.data} />
          </div>
        ))}
      </Styles>
    </span>
  )
}

export { BlueprintTable as DMTBluePrintTableView }
