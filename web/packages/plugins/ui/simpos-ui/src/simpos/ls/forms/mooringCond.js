import React from 'react'

import { makeStyles } from '@material-ui/core/styles'

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

function createMoorCond(ind, brokenLines, lineNumbers) {
  return {
    name: 'cond' + ind,
    description: '',
    type: 'app1local/simpos/mooringLS/positioning/Condition',
    label: '',
    brokenLines: brokenLines,
    lineNumbers: lineNumbers,
  }
}

function populateMoorConds(data) {
  var conds = []
  for (var i = 0; i < data.length; i++) {
    conds.push(createMoorCond(i, data[i].brokenLines, data[i].lineNumbers))
  }

  return conds
}

function LSMooringCond({ updateEntity, document, children }) {
  let conditions = document.mooringConditions.conditions
  //console.log(document);
  //console.log(conditions);

  const classes = useStyles()
  var data = []

  //TODO:
  // get access to the blueprints from here
  // add label to the blueprint attribute
  // automize creating columns based on entity items

  const columns = [
    { title: 'Broken Lines', field: 'brokenLines', cellStyle: cellStyle },
    { title: 'Line Numbers', field: 'lineNumbers', cellStyle: cellStyle },
  ]

  //console.log(columns);

  for (var i = 0; i < conditions.length; i++) {
    var dataItem = {}
    for (var coli = 0; coli < columns.length; coli++) {
      var attrName = columns[coli]['field']
      dataItem[attrName] = conditions[i][attrName]
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
                console.log(populateMoorConds(data))
                console.log(document)
                document.mooringConditions.conditions = populateMoorConds(data)
                updateEntity(document)
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
                  console.log(populateMoorConds(data))
                  document.mooringConditions.conditions = populateMoorConds(
                    data
                  )
                  updateEntity(document)
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
                console.log(populateMoorConds(data))
                document.mooringConditions.conditions = populateMoorConds(data)
                updateEntity(document)
                return { ...prevState, data }
              })
            }, 600)
          }),
      }}
    />
  )
}

export { LSMooringCond }
