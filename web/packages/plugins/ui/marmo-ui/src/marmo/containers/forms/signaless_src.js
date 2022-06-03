import React from 'react'
import { Component } from 'react'

import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'
import { withStyles } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'

import { DynamicTable } from '../../forms/DynamicTable.js'
//import { MakeMooringConditionTemplate } from './templates/mooringCondition.js'

import { Entity } from '../../forms/entity.js'
import { DocForm } from '../../forms/docForm.js'

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 12,
  },
}))(Tooltip)

const MakeMooringConditionTemplate = () => {
  return {}
}
//****************************************************** */
class Form extends Component {
  constructor(props) {
    super(props)
    this.props = props

    this.objs = []

    for (var ind = 0; ind < props.document.value.length; ind++) {
      this.objs.push({
        x: ind * props.document.xdelta + props.document.xstart,
        y: props.document.value[ind],
      })
    }

    this.items = ['x', 'y']

    this.entities = {
      env: new Entity({ document: props.document.env }),
      screeningConfig: new Entity({ document: props.document.screeningConfig }),
    }

    this.state = { rows: [] }
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

  handleChange = (event) => {
    const { id, value } = event.target
    this.props.document[id] = value
  }

  updateDoc = () => {
    console.log('** updating document')
    console.log(this.props.document)

    console.log(this.state)

    //updating the array of objects in the table
    this.props.document.mooring.conditions = []

    for (var i = 0; i < this.state.rows.length; i++) {
      var mcond = MakeMooringConditionTemplate()
      mcond.name = 'conditions_' + i
      for (var pname in this.state.rows[i]) {
        this.setAttribute(mcond, pname, this.state.rows[i][pname])
      }
      this.props.document.mooring.conditions.push(mcond)
    }

    //updating the single objects
    this.props.document.env = this.entities.env.document
    this.props.document.screeningConfig = this.entities.screeningConfig.document

    console.log(this.props.document)

    this.props.updateEntity(this.props.document)
  }

  render() {
    return (
      <form>
        <Box width="100%">
          <LightTooltip title="scenario description" placement="right-end">
            <TextField
              id={'description'}
              label={'Description'}
              multiline
              maxRows="4"
              inputProps={{ style: { fontSize: 16 } }} // font size of input text
              InputLabelProps={{ style: { fontSize: 16 } }} // font size of input label
              variant="filled"
              defaultValue={' '}
              onChange={this.handleChange}
            />
          </LightTooltip>
          {/*
          <Box m={2} />
            <DocForm entity={this.entities.env} />
          <Box m={2} />
          <Box width="80%">
            <DocForm entity={this.entities.screeningConfig} />
          </Box>
          */}
        </Box>
        <Box width="80%">
          <Box m={2} />
          {/*
          <DynamicTable
            createEntity={MakeMooringConditionTemplate}
            objs={this.objs}
            items={this.items}
            state={this.state}
            open={this.props.open}
            setOpen={this.props.setOpen}
          />
          */}
          <Box m={3} />
          <Button
            variant="contained"
            size="large"
            onClick={this.updateDoc}
            color="primary"
          >
            Submit
          </Button>
        </Box>
      </form>
    )
  }
}
//****************************************************** */

const SignalESSForm = ({ updateEntity, document }) => {
  const [open, setOpen] = React.useState(false)

  return (
    <div>
      <Form
        document={document}
        updateEntity={updateEntity}
        open={open}
        setOpen={setOpen}
      />
    </div>
  )
}

export { SignalESSForm as SignalESSForm }
