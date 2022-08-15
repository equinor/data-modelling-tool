import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

function createData(index, value) {
  return { index, value }
}

const useStyles = makeStyles({
  root: {
    width: '30%',
  },
  container: {
    maxHeight: 740,
  },
})

const ESSTablePlugin = ({ document }) => {
  //console.log(document)

  let xlabel = ''
  if (document.xlabel != '') {
    xlabel = document.xlabel
  } else {
    xlabel = document.xname
  }
  if (document.xunit != '') {
    xlabel = xlabel + '[' + document.xunit + ']'
  }

  let ylabel = ''
  if (document.label != '') {
    ylabel = document.label
  } else {
    ylabel = document.name
  }
  if (document.unit != '') {
    ylabel = ylabel + '[' + document.unit + ']'
  }

  let columns = [
    {
      id: 'index',
      label: xlabel,
      minWidth: 30,
      align: 'right',
      format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'value',
      label: ylabel,
      minWidth: 100,
      align: 'right',
      format: (value) => value.toLocaleString('en-US'),
    },
  ]

  let rows = []

  for (var ind = 0; ind < document.value.length; ind++) {
    rows.push(
      createData(ind * document.xdelta + document.xstart, document.value[ind])
    )
  }

  const classes = useStyles()
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  return (
    <Paper className={classes.root} style={{ fontSize: 12 }}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={({ minWidth: column.minWidth }, { fontSize: 14 })}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.index}>
                    {columns.map((column) => {
                      const value = row[column.id]
                      return (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{ fontSize: 12 }}
                        >
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100, 500, 1000, 5000]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        style={{ fontSize: 12 }}
      />
    </Paper>
  )
}

export { ESSTablePlugin as SignalTable }
