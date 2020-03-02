
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

import {OBJModel} from 'react-3d-viewer';

import { Component } from 'react';

import styled from 'styled-components';
import { useTable } from 'react-table';

import {useState} from 'react';
import useCollapse from 'react-collapsed';

import { FaChevronDown, FaChevronRight } from 'react-icons/fa'

/* ********************************************************* */
//Custom views
import {BlueprintTable} from './blueprint_views.js';
import {SRSReportView} from './view_SRSReportView.js';

/* ********************************************************* */

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

/* ********************************************************* */
/* ********************************************************* */


function PlotlyPoc(props) {
  const { updateEntity, document } = props
  return (
    <Plot
      data={[
        {
          x: [1, 2, 3],
          y: [2, 6, 3],
          type: 'scatter',
          mode: 'lines+markers',
          marker: { color: 'red' },
        },
        { type: 'bar', x: [1, 2, 3], y: [2, 5, 3] },
      ]}
      onClick={() => {
        document.description = 'test update'
        updateEntity(document)
      }}
      layout={{ width: 320, height: 240, title: 'A Fancy Plot' }}
    />
  )
}
//********************************************************//
//********************************************************//
//making tables
//********************************************************//




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

const SRSEnvTable = ({ parent, document, children }) => {
  //console.log(document);
  //console.log(parent);

  var tabs = [];

  var columns = [{
        Header: "Wave",
        columns: [
          {
            Header: "name",
            accessor: "name"
          },          
          {
            Header: "value",
            accessor: "value"
          },
          {
            Header: "description",
            accessor: "description"
          }        
        ]
      }];

  var data = [];
  var entity = document.wave;
  var propNames = ['waveDirection',
                   'significantWaveHeight', 
                   'peakPeriod'];
  var descs = ["Wave propagation direction -comming from- in [deg].",
               "Significant wave height in [m].",
               "Peak period in [s]."];
  for (var propi=0; propi<propNames.length; propi++ ){
    var propName = propNames[propi];
    data.push({
      "name": propName,
      "value": entity[propName],
      "description": descs[propi]
    })
  }

  tabs.push({data, columns})
  //console.log(data);
  //console.log(columns);

  var columns = [{
    Header: "Wind",
    columns: [
      {
        Header: "name",
        accessor: "name"
      },          
      {
        Header: "value",
        accessor: "value"
      },
      {
        Header: "description",
        accessor: "description"
      }        
    ]
  }];

  var data = [];
  var entity = document.wind;
  var propNames = ['windDirection',
                'windVelocity'];
  var descs = ["Wind direction -comming from- in [deg].",
              "Average wind speed 10[m] above mean water surface in [m/s]."];
  for (var propi=0; propi<propNames.length; propi++ ){
  var propName = propNames[propi];
  data.push({
    "name": propName,
    "value": entity[propName],
    "description": descs[propi]
  })
  }

  tabs.push({data, columns})
  //console.log(data);
  //console.log(columns);

var columns = [{
  Header: "Current",
  columns: [
    {
      Header: "currentDepths",
      accessor: "currentDepths"
    },          
    {
      Header: "currentDirections",
      accessor: "currentDirections"
    },
    {
      Header: "currentVelocities",
      accessor: "currentVelocities"
    }        
  ]
}];

var data = [];

var entity = document.current;
var propNames = ['currentDepths',
                 'currentDirections', 
                 'currentVelocities'];
var descs = ["Wave propagation direction -comming from- in [deg].",
             "Significant wave height in [m].",
             "Peak period in [s]."];
for (var propi=0; propi<entity.currentDepths.split(',').length; propi++ ){
  data.push({
    "currentDepths": entity.currentDepths.split(',')[propi],
    "currentDirections": entity.currentDirection,
    "currentVelocities": entity.currentVelocities.split(',')[propi]
  })
}

tabs.push({data, columns})
//console.log(data);
//console.log(columns);

  return (
    <Styles>
      {tabs.map((item, index) => 
       <div className="container" key={index}>
            <Table columns={item.columns} data={item.data} />
      </div>)}
    </Styles>
  );

}

const ESSTablePlugin = ({ parent, document, children }) => {
  console.log(document);
  return(JSON.stringify(document))
}

//********************************************************//
//********************************************************//

const TestPlugin = ({ parent, document, children }) => {

  return "my plugin"
}
//********************************************************//
//********************************************************//

const ESSPlotPlugin = ({ parent, document, children }) => {
  console.log(document);

  // const data = [
  //   {quarter: 1, earnings: 13000},
  //   {quarter: 2, earnings: 16500},
  //   {quarter: 3, earnings: 14250},
  //   {quarter: 4, earnings: 19000},
  //   {quarter: 5, earnings: -1000}
  // ];

  // return (
  //   <VictoryChart>
  //     <VictoryBar
  //       data={data}
  //       x="quarter"
  //       y="earnings"
  //     />
  //   </VictoryChart>
  // )

  let doc = document;
  let pdata = {};
  pdata['x'] = [0];
  pdata['y'] = [0];

  if (Array.isArray(doc.value)){
    pdata['y'] = doc.value;
    pdata['x'] = [];
    for(var i=0; i<doc.value.length;i++){
      pdata.x.push(doc.xstart + i*doc.xdelta);
    }
  }

  console.log(pdata);

  return (
    <Plot
      data={[
        {
          x: pdata.x,
          y: pdata.y,
          type: 'scatter',
          mode: 'lines+points',
          marker: {color: 'red'},
        }
      ]}
      layout={ {width: 620, height: 440, title: 'A Fancy Plot'} }
    />
  );

}

//********************************************************//
//********************************************************//
//Helper functions
const getXLabel = (signal) =>{
  var label = "";

  if (signal.xlabel !== undefined){
    label = signal.xlabel;
  }
  else if (signal.xname !== undefined){
    label = signal.xname;
    if (signal.xunit !== undefined){
      label += " [" + signal.xunit + "]";
    }
  }
  else {
    label = "time";
    if (signal.xunit !== undefined){
      label += " [" + signal.xunit + "]";
    }        
  }

  return label;
};

const getYLabel = (signal) =>{
  var label = "";

  if (signal.label !== undefined){
    label = signal.label;
  }
  else if (signal.name !== undefined){
    label = signal.name;
    if (signal.unit !== undefined){
      label += " [" + signal.unit + "]";
    }
  }
  else {
    label = "time";
    if (signal.unit !== undefined){
      label += " [" + signal.unit + "]";
    }        
  }

  return label;
};
//********************************************************//
const SRSResultsView = ({ parent, document, children }) => {
  console.log(document);

  // const data = [
  //   {quarter: 1, earnings: 13000},
  //   {quarter: 2, earnings: 16500},
  //   {quarter: 3, earnings: 14250},
  //   {quarter: 4, earnings: 19000},
  //   {quarter: 5, earnings: -1000}
  // ];

  // return (
  //   <VictoryChart>
  //     <VictoryBar
  //       data={data}
  //       x="quarter"
  //       y="earnings"
  //     />
  //   </VictoryChart>
  // )

  var pdatas = [];

  for (var sInd=0; sInd < document.signals.length; sInd++){
    let signal = document.signals[sInd];
    let pdata = {};
    pdata['x'] = [0];
    pdata['y'] = [0];

    if (Array.isArray(signal.value)){
      pdata['y'] = signal.value;
      pdata['x'] = [];
      for(var i=0; i<signal.value.length;i++){
        pdata.x.push(signal.xstart + i*signal.xdelta);
      }

      pdata['xlabel'] = getXLabel(signal);
      pdata['ylabel'] = getYLabel(signal);

    }
    pdatas.push(pdata);
  }
  console.log(pdatas);

  return ( <div className="container">
           { pdatas.map((item, index) =>(
          <div className="container" key={index}>
              <Plot
                data={[
                  {
                    x: item.x,
                    y: item.y,
                    type: 'scatter',
                    mode: 'lines+points',
                    marker: {color: 'red'},
                  }
                ]}
                layout={ {width: 620, height: 440, 
                          title: "",
                          xaxis: {
                            title: item.xlabel,
                            showgrid: true,
                            zeroline: true
                          },
                          yaxis: {
                            title: item.ylabel,
                            showgrid: true,
                            zeroline: true
                          },} }
              />
            </div>) ) }
            </div> )
   

}

//********************************************************//
const SRSStatusView = ({ parent, document, children }) => {
  console.log(document);

  return ( 
          <div className="container">
              <Plot
                data={[
                  {
                    x: [document.progress],
                    y: ['Progress'],
                    type: 'bar',
                    orientation: 'h'
                  }
                ]}
                layout={ {width: 600, height: 200, 
                          title: "",
                          xaxis: {
                            title: document.state,
                            range: [0, 100]
                          },
                          yaxis: {
                            title: ''
                          },} }
              />
            </div>) 
 
}
//********************************************************//

const SRSSce3DView = ({ parent, document, children }) => {
  console.log(document);

  return (
    <>
      <div>3d viewer</div>
      <div style={{ display: 'flex', alignItems: 'top' }}>
        <div style={{ display: 'inline-flex' }}>
          <OBJModel width={600} height={600} src="./AasgardPlatform.obj" texPath="" />
        </div>
      </div>
    </>
  )

  //return "hello";
    // return(
    //   <div>
    //     <OBJModel 
    //       width="400" height="400"  
    //       position={{x:0,y:0.0,z:0}} 
    //       src="./platform.obj"
    //       onLoad={()=>{
    //         //...
    //       }}
    //       onProgress={xhr=>{
    //         //...
    //       }}
    //     />
    //   </div>
    // )

}
//********************************************************//
//********************************************************//

const registeredPlugins = {
  'My plugin': TestPlugin,
  'Plotly': PlotlyPoc,

  'ESS Plot View': ESSPlotPlugin,
  'ESS Table View': ESSTablePlugin,
  'SRS Results View': SRSResultsView,
  'SRS Status View': SRSStatusView,
  'SRS Env. Table': SRSEnvTable,
  'Blueprint Table': BlueprintTable,
  'SRS Sce 3DView': SRSSce3DView,
  'SRS Report View': SRSReportView


}

export default function pluginHook(uiRecipe) {
  return registeredPlugins[uiRecipe.name]
}