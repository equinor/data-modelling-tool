
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

import React from 'react';
//import ReactDOM from 'react-dom';

import Plot from 'react-plotly.js';


import styled from 'styled-components';
import { useTable } from 'react-table';

import {useState} from 'react';
import useCollapse from 'react-collapsed';

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
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(
          (row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )}
        )}
      </tbody>
    </table>
  )
}

const ColTableData = (tabDoc) => {
  return {columns:[], data:[]};
}

const TransposedColTableData = (tabDoc) => {

  var columns = [];
  columns.push({"Header": tabDoc.strColumns[0].header, "accessor": ("col_"+0)});
  columns.push({"Header": tabDoc.strColumns[0].label, "accessor": ("col_"+1)});

  for (var i=0; i<tabDoc.strColumns[0].value.length; i++ ){
    columns.push({"Header": tabDoc.strColumns[0].value[i], 
                  "accessor": ("col_"+i+2)});
  }
    
  //console.log(columns)
                    
  var data = [];

  for (var i=1; i<tabDoc.strColumns.length; i++ ){
    var col = tabDoc.strColumns[i];
    var row = {};
    row['col_0'] = col.header;
    row['col_1'] = col.label; 
    for (var ri = 0; ri<col.value.length; ri++){
      row['col_'+ri+2] = col.value[ri]; 
    }
    data.push(row);
  }

  //console.log(data)

  return ({columns, data});

};

const TableView = ({ tabDoc }) => {
  console.log("*** Making Table");
  //console.log(tabDoc);

  let tabData;

  if (tabDoc.transposed) {
    tabData = TransposedColTableData(tabDoc);
  }
  else{
    tabData = ColTableData(tabDoc);
  }

  //console.log(tabData);


  return (
    <TableStyles>
      {<div className="container">
            <Table columns={tabData.columns} data={tabData.data} />
      </div>}
    </TableStyles>
  );

}

//********************************************************//
//********************************************************//
const PlotView = ({ plotDoc }) => {
  console.log("*** Making Plot");
  //console.log(plotDoc);

  var pdatas = [];

  return ( <div className="container">
              <Plot
                data={ plotDoc.lines.map(function(line) {
                          return ({
                                    x: line.xvalue,
                                    y: line.value,
                                    type: 'scatter',
                                    mode: 'lines+points',
                                    marker: {color: 'red'},
                                  })           
                          })  
                }
                layout={ {width: 1000, height: 400, 
                          title: plotDoc.title,
                          xaxis: {
                            title: plotDoc.xlabel,
                            showgrid: true,
                            zeroline: true
                          },
                          yaxis: {
                            title: plotDoc.ylabel,
                            showgrid: true,
                            zeroline: true
                          },} }
              />
            </div> )
}
//********************************************************//
const CollapsedView = ({ doc }) => {

  var sectionTitle = "";
  let section;
  var defaultState = false;

  if (doc.type.includes('XYPlot')) {
    section = <PlotView plotDoc={doc} />;
    sectionTitle = "Plot: " + doc.caption;
    defaultState = false;
  } else if (doc.type.includes('ColTable')){
    section = <TableView tabDoc={doc} />;
    defaultState = true;
    sectionTitle = "Table: " + doc.caption;
  }
  else {
    console.log(doc.type + " is not known. : view_SRSReportView");
  }  

  const [isOpen, setOpen] = useState(defaultState);
  const {getCollapseProps, getToggleProps} = useCollapse({isOpen});

  return (
    <Wrapper>
      <Toggle {...getToggleProps({
          onClick: () => setOpen(oldOpen => !oldOpen),
        })}>
        <Icons>
          {isOpen && <FaChevronDown />}
          {!isOpen && <FaChevronRight />}
        </Icons>
        {sectionTitle}
      </Toggle>
      <Content {...getCollapseProps()}>
        {section}
      </Content>
    </Wrapper>
  );

}
//********************************************************//
const SectionView = ({ doc }) => {

  const [isOpen, setOpen] = useState(true);
  const {getCollapseProps, getToggleProps} = useCollapse({isOpen});

  const sectionTitle = doc.name;

  return (
    <Wrapper>
      <Toggle {...getToggleProps({
          onClick: () => setOpen(oldOpen => !oldOpen),
        })}>
        <Icons>
          {isOpen && <FaChevronDown />}
          {!isOpen && <FaChevronRight />}
        </Icons>
        {sectionTitle}
      </Toggle>
      <Content {...getCollapseProps()}>
        { doc.sections.map((item, index) =>(
        <SectionView doc={item}/> )
                  ) }         
        { doc.tables.map((item, index) =>(
        <CollapsedView doc={item}/> )
                  ) }      
        { doc.plots.map((item, index) =>(
        <CollapsedView doc={item}/> )
                 ) }      
      </Content>
    </Wrapper>
  );

}
//********************************************************//
const SRSReportView = ({ parent, document, children }) => {

  return (
    <div className="container">
      <SectionView doc={document}/> 
    </div>
  )
}

//********************************************************//
//********************************************************//

export {SRSReportView as SRSReportView};