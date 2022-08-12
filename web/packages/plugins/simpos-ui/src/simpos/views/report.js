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
import Plot from 'react-plotly.js'

import { useState } from 'react'
import useCollapse from 'react-collapsed'

import { FaChevronDown, FaChevronRight } from 'react-icons/fa'

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
const Wrapper = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 2px;
`

const Toggle = styled.div`
  background-color: #f4f4f4;
  color: #444;
  cursor: pointer;
  padding: 6px;
  width: 100%;
  text-align: left;
  border: none;
`

const Content = styled.div`
  padding: 5px;
  animation: fadein 0.35s ease-in;
`
const Icons = styled.span`
  margin-right: 5px;
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

const ColTableData = (tabDoc) => {
  var columns = []

  for (var i = 0; i < tabDoc.columns.length; i++) {
    columns.push({
      Header: tabDoc.columns[i].header + ' ' + tabDoc.columns[i].label,
      accessor: 'col_' + i,
    })
  }

  const nrows = tabDoc.columns[0].value.length

  var data = []

  // var row = {}
  // for (var i = 0; i < tabDoc.columns.length; i++) {
  //   row['col_'+ i] = tabDoc.columns[i].label
  // }
  // data.push(row)

  for (var ri = 0; ri < nrows; ri++) {
    var row = {}
    for (var i = 0; i < tabDoc.columns.length; i++) {
      row['col_' + i] = tabDoc.columns[i].value[ri]
    }
    data.push(row)
  }

  return { columns, data }
}

const TransposedColTableData = (tabDoc) => {
  var columns = []
  columns.push({ Header: tabDoc.columns[0].header, accessor: 'col_' + 0 })
  columns.push({ Header: tabDoc.columns[0].label, accessor: 'col_' + 1 })

  for (var i = 0; i < tabDoc.columns[0].cells.length; i++) {
    columns.push({
      Header: tabDoc.columns[0].cells[i],
      accessor: 'col_' + i + 2,
    })
  }

  var data = []

  for (var i = 1; i < tabDoc.columns.length; i++) {
    var col = tabDoc.columns[i]
    var row = {}
    row['col_0'] = col.header
    row['col_1'] = col.label
    for (var ri = 0; ri < col.cells.length; ri++) {
      row['col_' + ri + 2] = col.cells[ri]
    }
    data.push(row)
  }

  return { columns, data }
}

const TableView = ({ tabDoc }) => {
  let tabData

  if (tabDoc.transposed) {
    tabData = TransposedColTableData(tabDoc)
  } else {
    tabData = ColTableData(tabDoc)
  }

  return (
    <TableStyles>
      {
        <div className="container">
          <Table columns={tabData.columns} data={tabData.data} />
        </div>
      }
    </TableStyles>
  )
}

//********************************************************//
//********************************************************//
const PlotView = ({ plotDoc }) => {
  var pdatas = []

  return (
    <div className="container">
      <Plot
        data={plotDoc.lines.map(function (line) {
          if (line.linestyle == 'bar') {
            return {
              x: line.x,
              y: line.y,
              type: 'bar',
              marker: {
                color: '#' + line.color,
              },
            }
          }
          return {
            x: line.x,
            y: line.y,
            type: line.style,
            mode: 'lines',
            line: {
              color: '#' + line.color,
              width: line.linewidth,
            },
          }
        })}
        layout={{
          width: 1000,
          height: (1000 * plotDoc.height) / plotDoc.width,
          title: plotDoc.showtitle === true ? plotDoc.title : '',
          xaxis: {
            title: plotDoc.xlabel,
            showgrid: true,
            zeroline: true,
          },
          yaxis: {
            title: plotDoc.ylabel,
            showgrid: true,
            zeroline: true,
          },
        }}
      />
    </div>
  )
}
//********************************************************//
const CollapsedView = ({ doc }) => {
  var sectionTitle = ''
  let section
  var defaultState = false
  const [isOpen, setOpen] = useState(defaultState)
  const { getCollapseProps, getToggleProps } = useCollapse({ isOpen })

  if (doc.type.includes('ReportFragment')) {
    section = <FragmentView doc={doc} />
    sectionTitle = doc.name
    defaultState = false
  } else if (doc.type.includes('Section')) {
    section = <SectionView doc={doc} />
    sectionTitle = section.title
    defaultState = false
    return <Content>{section}</Content>
  } else if (doc.type.includes('LinePlot')) {
    section = <PlotView plotDoc={doc} />
    sectionTitle = 'Plot: ' + doc.caption
    defaultState = false
  } else if (doc.type.includes('Table')) {
    section = <TableView tabDoc={doc} />
    defaultState = true
    sectionTitle = 'Table: ' + doc.caption
  } else if (doc.type.includes('Paragraph')) {
    section = <ParagraphView doc={doc} />
    defaultState = false
  } else {
  }

  return (
    <>
      <Toggle
        {...getToggleProps({
          onClick: () => {
            setOpen((oldOpen) => !oldOpen)
          },
        })}
      >
        <Icons>
          {isOpen && <FaChevronDown />}
          {!isOpen && <FaChevronRight />}
        </Icons>
        {sectionTitle}
      </Toggle>
      <Content {...getCollapseProps()}>{section}</Content>
    </>
  )
}
const SimpleView = ({ doc }) => {
  var sectionTitle = ''
  let section
  var defaultState = false
  const [isOpen, setOpen] = useState(defaultState)
  // const { getCollapseProps, getToggleProps } = useCollapse({ isOpen })

  if (doc.type.includes('ReportFragment')) {
    return <FragmentView doc={doc} />
    sectionTitle = doc.name
    defaultState = false
  } else if (doc.type.includes('Section')) {
    return <SectionView doc={doc} />
    sectionTitle = section.title
    defaultState = false
    return <Content>{section}</Content>
  } else if (doc.type.includes('LinePlot')) {
    return <PlotView plotDoc={doc} />
    sectionTitle = 'Plot: ' + doc.caption
    defaultState = false
  } else if (doc.type.includes('Table')) {
    return <TableView tabDoc={doc} />
    defaultState = true
    sectionTitle = 'Table: ' + doc.caption
  } else if (doc.type.includes('Paragraph')) {
    return <ParagraphView doc={doc} />
    defaultState = false
  } else {
    return null
  }
}
//********************************************************//
const SectionView = ({ doc }) => {
  const [isOpen, setOpen] = useState(true)
  const { getCollapseProps, getToggleProps } = useCollapse({ isOpen })

  const sectionTitle = doc.name

  return (
    <Wrapper>
      <Toggle
        {...getToggleProps({
          onClick: () => setOpen((oldOpen) => !oldOpen),
        })}
      >
        <Icons>
          {isOpen && <FaChevronDown />}
          {!isOpen && <FaChevronRight />}
        </Icons>
        {sectionTitle}
      </Toggle>
      <Content {...getCollapseProps()}>
        {doc.items.map((item, index) => (
          <SimpleView doc={item} key={index} />
        ))}
      </Content>
    </Wrapper>
  )
}

//********************************************************//
const ParagraphView = ({ doc }) => {
  return (
    //Does not work..
    <div>{doc.text}</div>
  )
}

//********************************************************//
const FragmentView = ({ doc }) => {
  return (
    <Content>
      {doc.items.map((item, index) => (
        <SimpleView doc={item} key={index} />
      ))}
    </Content>
  )
}
//********************************************************//
const ReportView = ({ document }) => {
  return (
    <div className="container">
      <SimpleView doc={document} />
    </div>
  )
}

//********************************************************//
//********************************************************//

export { ReportView as SimposReportView }
