import React from 'react'
import { Component } from 'react'

import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'
import { withStyles } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'

import { DynamicTable } from '../../forms/DynamicTable.js'
import { MakeEnvTemplate } from './templates/env.js'

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

//****************************************************** */
class Form extends Component {
  constructor(props) {
    super(props)
    this.props = props

    this.objs = props.document.envs
    this.items = [
      'wave.waveDirection',
      'wave.significantWaveHeight',
      'wave.peakPeriod',
      'wind.windDirection',
      'wind.windVelocity',
      'current.currentDirection',
      'current.currentDepths',
      'current.currentVelocities',
    ]

    this.entityConfig = new Entity({ document: props.document.config })

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
    this.props.document.envs = []
    for (var i = 0; i < this.state.rows.length; i++) {
      var env = MakeEnvTemplate()
      env.name = 'envs_' + i
      for (var pname in this.state.rows[i]) {
        this.setAttribute(env, pname, this.state.rows[i][pname])
      }
      this.props.document.envs.push(env)
    }

    this.props.document.config = this.entityConfig.document

    console.log(this.props.document)

    this.props.updateEntity(this.props.document)
  }

  render() {
    return (
      <form>
        <Box width="50%">
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

          <Box m={2} />
          <DocForm entity={this.entityConfig} />
        </Box>
        <Box width="100%">
          <Box m={2} />
          <DynamicTable
            createEntity={MakeEnvTemplate}
            objs={this.objs}
            items={this.items}
            state={this.state}
            open={this.props.open}
            setOpen={this.props.setOpen}
          />
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

const RAOSce = ({ updateEntity, document }) => {
  const [open, setOpen] = React.useState(false)

  let objs = document.envs

  var items = [
    'wave.waveDirection',
    'wave.significantWaveHeight',
    'wave.peakPeriod',
    'wind.windDirection',
    'wind.windVelocity',
    'current.currentDirection',
    'current.currentDepths',
    'current.currentVelocities',
  ]

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

export { RAOSce as RAOSceForm }
