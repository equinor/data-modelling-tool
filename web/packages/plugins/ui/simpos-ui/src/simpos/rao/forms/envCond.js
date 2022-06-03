import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { EntityParser } from '../../../dmt/tools/EntityParser.js'
import { MakeEnvTemplate } from './templates/env.js'

import { forwardRef } from 'react'

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
}

const useStyles = makeStyles({
  root: {
    'min-height': '36pt',
    'font-size': '50pt',
  },
})

const cellStyle = {
  fontSize: '11pt',
}
const headerStyle = {
  backgroundColor: '#01579b',
  color: '#FFF',
  fontSize: '12pt',
}

const specialProps = ['name', 'type', 'description', 'label', '_id']

/* ********************************************************** */
const parser = new EntityParser()

/* ********************************************************** */
function createEnv(ind, data) {
  var env = MakeEnvTemplate()

  env.name = 'envs_' + (ind + 1)

  return env
}

function populate(document, data) {
  var objs = []
  for (var i = 0; i < data.length; i++) {
    objs.push(createEnv(i, data[i]))
  }

  var doc = { ...document }
  doc.envs = objs
  return doc
}

function getItem(entity, objPath) {
  var paths = objPath.split('.')
  var obj = entity

  for (var i = 0; i < paths.length; i++) {
    obj = obj[paths[i]]
  }
  var name = paths[paths.length - 1]

  return { name, obj }
}

function DynamicTable({
  updateEntity,
  populate,
  document,
  template,
  objs,
  items,
}) {
  //console.log(document);
  //console.log(conditions);

  const classes = useStyles()
  var data = []
  var columns = []

  //TODO:
  // get access to the blueprints from here
  // add label to the blueprint attribute
  // automize creating columns based on entity items
  var item = null

  for (var ii = 0; ii < items.length; ii++) {
    var itemPath = items[ii]
    item = getItem(template, itemPath)
    columns.push({
      title:
        item.obj.label === undefined
          ? item.obj.name === undefined
            ? item.name
            : item.obj.name
          : item.obj.label,
      field: itemPath,
      cellStyle: cellStyle,
      emptyValue:
        item.obj.value === undefined ? item.obj + '' : item.obj.value + '',
    })
  }

  //console.log(columns);

  for (var i = 0; i < objs.length; i++) {
    var dataItem = {}
    for (var coli = 0; coli < columns.length; coli++) {
      var attrName = columns[coli]['field']
      item = getItem(objs[i], attrName)
      dataItem[attrName] =
        item.obj.value === undefined ? item.obj : item.obj.value
    }
    data.push(dataItem)
  }

  const [state, setState] = React.useState({
    columns: columns,
    data: data,
  })

  return (
    <MaterialTable
      icons={tableIcons}
      title="Editable Example"
      columns={state.columns}
      data={state.data}
      options={{
        headerStyle: headerStyle,
        search: false,
        sorting: false,
        showTitle: false,
        toolbarButtonAlignment: 'right',
      }}
      components={{
        Toolbar: (props) => (
          <div style={{ height: '46px' }}>
            <MTableToolbar {...props} />
          </div>
        ),
      }}
      editable={{
        onRowAdd: (newData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve()
              setState((prevState) => {
                const data = [...prevState.data]
                data.push(newData)
                //console.log(populate(document, data));
                //console.log(document);
                updateEntity(populate(document, data))
                return { ...prevState, data }
              })
            }, 600)
          }),
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve()
              if (oldData) {
                setState((prevState) => {
                  const data = [...prevState.data]
                  data[data.indexOf(oldData)] = newData
                  //console.log(populate(document, data));
                  updateEntity(populate(document, data))
                  return { ...prevState, data }
                })
              }
            }, 600)
          }),
        onRowDelete: (oldData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve()
              setState((prevState) => {
                const data = [...prevState.data]
                data.splice(data.indexOf(oldData), 1)
                //console.log(populate(document, data));
                updateEntity(populate(document, data))
                return { ...prevState, data }
              })
            }, 600)
          }),
      }}
    />
  )
}

function RAOEnvCond({ updateEntity, document, children }) {
  let objs = document.envs

  var items = [
    'wave.significantWaveHeight',
    'wave.peakPeriod',
    'wave.waveDirection',
  ]
  var template = MakeEnvTemplate()

  return (
    <div>
      {DynamicTable({
        updateEntity,
        populate,
        document,
        template,
        objs,
        items,
      })}
    </div>
  )
}

export { RAOEnvCond }
