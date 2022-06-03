import React from 'react'
import { Component } from 'react'

import styled from 'styled-components'

import { EntityParser } from '../../dmt/tools/EntityParser.js'

import { makeStyles } from '@material-ui/core/styles'
import { withStyles } from '@material-ui/core/styles'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'

import Tooltip from '@material-ui/core/Tooltip'
import Box from '@material-ui/core/Box'

import TextField from '@material-ui/core/TextField'

import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'

import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import AddIcon from '@material-ui/icons/AddCircleOutline'
import ImportExportIcon from '@material-ui/icons/ImportExport'
import SaveIcon from '@material-ui/icons/Save'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import CloseIcon from '@material-ui/icons/Close'

import MuiDialog from '@material-ui/core/Dialog'
import MuiDialogActions from '@material-ui/core/DialogActions'
import MuiDialogContent from '@material-ui/core/DialogContent'
import MuiDialogContentText from '@material-ui/core/DialogContentText'
import MuiDialogTitle from '@material-ui/core/DialogTitle'

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 14,
  },
}))(Tooltip)

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontSize: 16,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell)

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
}))(TableRow)

const ActionTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
    fontSize: 16,
    width: 10,
  },
  body: {
    width: 10,
  },
}))(TableCell)

const ActionTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
}))(TableRow)

const StyledIconButton = withStyles((theme) => ({
  root: {
    margin: theme.spacing(0.1),
    padding: 'none',
  },
}))(IconButton)

const Dialog = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialog)

const DialogActions = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogActions)

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    fontSize: 18,
  },
}))(MuiDialogContent)

const DialogContentText = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    fontSize: 18,
  },
}))(MuiDialogContentText)

// const DialogTitle = withStyles(theme => ({
//   root: {
//     padding: theme.spacing(2),
//     fontSize: 50
//   },
// }))(MuiDialogTitle);

const styles_DialogTitle = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    fontSize: 40,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
})

const DialogTitle = withStyles(styles_DialogTitle)((props) => {
  const { children, classes, onClose, ...other } = props
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  )
})

const DiagButton = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    fontSize: 14,
  },
}))(Button)

const styles_TextField = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    fontSize: 40,
  },
  multiline: {
    margin: 0,
    padding: theme.spacing(2),
    fontSize: 40,
  },
  inputBase: {
    margin: 0,
    padding: theme.spacing(2),
    fontSize: 40,
  },
  inputMultiline: {
    margin: 0,
    padding: theme.spacing(2),
    fontSize: 40,
  },
})

const DiagTextField = withStyles(styles_TextField)((props) => {
  const { children, classes, ...other } = props
  return (
    <TextField className={classes.root} {...other}>
      {children}
    </TextField>
  )
})

const StyledTextField = styled(TextField)`
  .MuiInputBase-root {
    font-size: 12px;
    font-weight: 400;
    line-height: 20pt;
  }
  .MuiInput-underline::before {
    border-bottom-color: white;
  }
  .MuiInput-underline:hover:not(.Mui-disabled)::before {
    border-bottom-color: white;
  }
  .MuiInput-underline::after {
    border-bottom-color: #fdcd39;
  }
`

// const DiagTextField = withStyles(theme => ({
//   root: {
//     padding: theme.spacing(2),
//     fontSize: 20
//   },
// }))(TextField);

/* ********************************************************** */
const specialProps = ['name', 'type', 'description', 'label', '_id']

const parser = new EntityParser()

/* ********************************************************** */

class DynamicTable extends Component {
  constructor(props) {
    super(props)

    this.props = props

    this.objs = props.objs
    this.createEntity = props.createEntity
    this.items = props.items
    this.parentState = props.state

    this.entity = this.createEntity()

    // if (this.objs.length === 0) {
    //   this.objs.push(this.createEntity());
    // }

    this.columns = this.updateColumns()
    this.state = { rows: this.updateRows() }

    this.parentState.rows = this.state.rows

    this.importedText = ''
  }

  findAttribute = (entity, objPath) => {
    var paths = objPath.split('.')
    var parent = null
    var child = entity

    for (var i = 0; i < paths.length; i++) {
      parent = child
      child = parent[paths[i]]
    }
    var name = paths[paths.length - 1]

    return { name, child, parent }
  }

  getAttribute = (entity, objPath) => {
    var att = this.findAttribute(entity, objPath)
    var name = att.name
    var obj = att.child
    return { name, obj }
  }

  setAttribute = (entity, objPath, value) => {
    var att = this.findAttribute(entity, objPath)

    if (att.child.value === undefined) {
      att.parent[att.name] = value
    } else {
      att.child.value = value
    }
  }

  setItem = (objPath, value) => {
    var ind = Number(objPath.split('[')[1].split([']'])[0])
    var id = objPath.split('[')[0]

    const { rows } = this.state
    rows[ind][id] = value

    this.setState({
      rows: rows,
    })

    this.parentState.rows = this.state.rows
  }

  guessType = (val) => {
    if (isNaN(val)) {
      if (val.indexOf(',') === -1) {
        return 'string'
      } else {
        return 'string'
      }
    } else {
      return 'number'
    }
  }

  updateColumns = () => {
    var cols = []

    for (var ii = 0; ii < this.items.length; ii++) {
      var itemPath = this.items[ii]
      var item = this.getAttribute(this.entity, itemPath)
      var col = {
        title:
          item.obj.label === undefined
            ? item.obj.name === undefined
              ? item.name
              : item.obj.name
            : item.obj.label,
        tooltip: item.obj.description === undefined ? '' : item.obj.description,
        default:
          item.obj.value === undefined ? item.obj + '' : item.obj.value + '',
        id: itemPath,
      }
      col['fieldType'] = this.guessType(col.default)
      cols.push(col)
    }

    return cols
  }

  objToRow = (obj) => {
    var row = {}
    for (var coli = 0; coli < this.columns.length; coli++) {
      var attrName = this.columns[coli].id
      var item = this.getAttribute(obj, attrName)
      row[attrName] = item.obj.value === undefined ? item.obj : item.obj.value
    }

    return row
  }

  updateRows = () => {
    var rows = []

    for (var i = 0; i < this.objs.length; i++) {
      rows.push(this.objToRow(this.objs[i]))
    }

    return rows
  }

  addRow = () => {
    const { rows } = this.state
    if (rows.length > 0) rows.push({ ...rows[rows.length - 1] })
    else rows.push(this.objToRow(this.createEntity()))

    console.log(rows)

    this.setState({
      rows: rows,
    })
    this.parentState.rows = this.state.rows
  }

  deleteRow = (ind) => {
    // console.log("delet clicked");
    const { rows } = this.state
    var delRow = rows.splice(ind, 1)
    this.setState({
      rows: rows,
    })
    this.parentState.rows = this.state.rows

    // console.log(this.state);
  }

  cleanRows = () => {
    // console.log("delet clicked");

    this.setState({
      rows: [],
    })
    this.parentState.rows = this.state.rows

    // console.log(this.state);
  }

  shiftRowUp = (ind) => {
    //console.log("shifting up")
    if (ind === 0) return

    var newRows = []
    const { rows } = this.state
    for (var i = 0; i < rows.length; i++) {
      if (i < ind - 1) newRows.push(rows[i])
      else if (i === ind - 1) newRows.push(rows[ind])
      else if (i === ind) newRows.push(rows[ind - 1])
      else newRows.push(rows[i])
    }
    this.setState({ rows: newRows })
    this.parentState.rows = this.state.rows

    //console.log(this.state);
  }

  shiftRowDown = (ind) => {
    //console.log("shifting up")
    var newRows = []
    const { rows } = this.state

    if (ind === rows.length - 1) return

    for (var i = 0; i < rows.length; i++) {
      if (i < ind) newRows.push(rows[i])
      else if (i === ind) newRows.push(rows[ind + 1])
      else if (i === ind + 1) newRows.push(rows[ind])
      else newRows.push(rows[i])
    }
    this.setState({ rows: newRows })
    this.parentState.rows = this.state.rows

    //console.log(this.state);
  }

  handleChange = (event) => {
    const { id, value, defaultValue, type } = event.target

    //console.log(id);
    //console.log(value);
    //console.log(defaultValue);

    if (type === 'number') {
      this.setItem(id, Number(value))
    } else {
      this.setItem(id, value)
    }
    this.parentState.rows = this.state.rows

    // console.log(this.state);
  }

  importTextHandleChange = (event) => {
    const { id, value } = event.target
    this.importedText = value
  }

  getRowsTextRepresentation = () => {
    var lines = []
    // if (this.state.rows.length > 0) {
    //   var items = [];
    //   for (var pname in this.state.rows[0]) {
    //     items.push("#" +  pname);
    //   }

    //   lines.push(items.join("\t"));
    // }

    for (var i = 0; i < this.state.rows.length; i++) {
      var items = []
      for (var pname in this.state.rows[i]) {
        items.push(this.state.rows[i][pname])
      }
      lines.push(items.join('\t'))
    }

    this.importedText = lines.join('\n')
    return this.importedText
  }

  import = () => {
    console.log('importing ...')
    console.log(this.importedText)
    this.cleanRows()

    var lines = this.importedText.split('\n')
    var rows = []
    for (var i = 0; i < lines.length; i++) {
      var cells = lines[i].split('\t')
      var row = this.objToRow(this.createEntity())

      if (this.items.length != cells.length) {
        console.log('Error: the number of columns does not match the table.')
      } else {
        for (var ind = 0; ind < this.items.length; ind++) {
          var val = cells[ind].trim()
          if (this.guessType(val) === 'number') {
            val = Number(val)
          }
          row[this.items[ind]] = val
        }
        rows.push(row)
      }
    }

    //console.log(rows);
    this.setState({ rows: rows })
    this.parentState.rows = this.state.rows
  }

  render() {
    //const classes = useStyles();

    //const [open, setOpen] = React.useState(false);

    const open = this.props.open

    const handleClickOpen = () => {
      this.props.setOpen(true)
    }

    const handleCancel = () => {
      this.props.setOpen(false)
    }

    const handleImport = () => {
      this.props.setOpen(false)
      this.import()
    }

    var cols = this.columns
    var rows = this.state.rows
    // console.log("cols: ")
    // console.log(cols);
    // console.log("rows: ")
    // console.log(rows);

    return (
      <div>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="simple table">
            <TableHead>
              <TableRow>
                <ActionTableCell> {'Actions'} </ActionTableCell>
                {cols.map((col, ind) => (
                  <LightTooltip
                    title={col.tooltip}
                    placement="right-end"
                    key={ind}
                  >
                    <StyledTableCell> {col.title} </StyledTableCell>
                  </LightTooltip>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, ind) => (
                <StyledTableRow key={ind}>
                  <ActionTableCell
                    component="th"
                    scope="row"
                    key={'save_' + ind}
                  >
                    <div>
                      {/* <ButtonGroup color="primary" aria-label="outlined primary button group"> */}
                      <Grid container spacing={3}>
                        <Grid item xs={3}>
                          <LightTooltip
                            title={'Delete row'}
                            placement="right-end"
                            key={'deltp' + ind}
                          >
                            <IconButton
                              aria-label="delete"
                              onClick={() => this.deleteRow(ind)}
                            >
                              <DeleteIcon id={'del_' + ind} />
                            </IconButton>
                          </LightTooltip>
                        </Grid>
                        <Grid item xs={3}>
                          <LightTooltip
                            title={'Shift row down'}
                            placement="right-end"
                            key={'shiftdownTP' + ind}
                          >
                            <IconButton
                              aria-label="down"
                              onClick={() => this.shiftRowDown(ind)}
                            >
                              <ArrowDownwardIcon />
                            </IconButton>
                          </LightTooltip>
                        </Grid>
                        <Grid item xs={3}>
                          <LightTooltip
                            title={'Shift row up'}
                            placement="right-end"
                            key={'shiftupoTP' + ind}
                          >
                            <IconButton
                              aria-label="up"
                              onClick={() => this.shiftRowUp(ind)}
                            >
                              <ArrowUpwardIcon />
                            </IconButton>
                          </LightTooltip>
                        </Grid>
                      </Grid>
                      {/* </ButtonGroup> */}
                    </div>
                  </ActionTableCell>
                  {cols.map((col, coli) => (
                    <StyledTableCell
                      component="th"
                      scope="row"
                      key={col.id + '_' + ind}
                    >
                      <TextField
                        id={col.id + '[' + ind + ']'}
                        inputProps={{ style: { fontSize: 16 } }} // font size of input text
                        //InputLabelProps={{ style: { fontSize: 16 } }} // font size of input label
                        //variant="filled"
                        //error ={this.errState.length === 0 ? false : true }
                        helperText={''}
                        type={col.fieldType}
                        value={row[col.id]}
                        onChange={this.handleChange}
                      />
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box width="20%">
          <Grid container spacing={3}>
            <Grid item xs={3}>
              <LightTooltip
                title={'Add a new row'}
                placement="right-end"
                key={'addTP'}
              >
                <IconButton aria-label="add" onClick={() => this.addRow()}>
                  <AddIcon fontSize={'large'} />
                </IconButton>
              </LightTooltip>
            </Grid>
            <Grid item xs={3}>
              <LightTooltip
                title={'Delete all'}
                placement="right-end"
                key={'delAllTP'}
              >
                <IconButton
                  aria-label="delAll"
                  onClick={() => this.cleanRows()}
                >
                  <DeleteIcon fontSize={'large'} />
                </IconButton>
              </LightTooltip>
            </Grid>
            <Grid item xs={3}>
              <LightTooltip
                title={'Import data'}
                placement="right-end"
                key={'importTP'}
              >
                <IconButton aria-label="add" onClick={handleClickOpen}>
                  <ImportExportIcon fontSize={'large'} />
                </IconButton>
              </LightTooltip>
            </Grid>
          </Grid>
        </Box>

        <Dialog
          open={open}
          onClose={handleCancel}
          aria-labelledby="form-dialog-title"
          fullWidth={true}
          maxWidth={'md'}
        >
          <DialogTitle onClose={handleCancel} id="form-dialog-title">
            Import
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter the data as tab separated items. Tab can not be entered
              directly here. Copy/pasting from Excel if the best option.
            </DialogContentText>
            <StyledTextField
              inputProps={{ style: { fontSize: 20 } }} // font size of input text
              InputLabelProps={{ style: { fontSize: 20 } }} // font size of input label
              //margin="dense"
              id="name"
              label="Data"
              multiline
              fullWidth
              maxRows="20"
              variant="outlined"
              defaultValue={this.getRowsTextRepresentation()}
              onChange={this.importTextHandleChange}
            />
          </DialogContent>
          <DialogActions>
            <DiagButton onClick={handleCancel} color="primary">
              Cancel
            </DiagButton>
            <DiagButton onClick={handleImport} color="primary">
              Import
            </DiagButton>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export { DynamicTable }
