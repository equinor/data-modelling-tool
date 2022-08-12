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

//****************************************************** */

import React from 'react'
import { Component } from 'react'

import { spacing } from '@material-ui/system'

import { Entity } from '../../forms/entity.js'
import { DocForm } from '../../forms/docForm.js'

//****************************************************** */
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'

import TextField from '@material-ui/core/TextField'
import { withStyles } from '@material-ui/core/styles'

import Tooltip from '@material-ui/core/Tooltip'

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 12,
  },
}))(Tooltip)

//****************************************************** */
class FormTest extends Component {
  constructor(props) {
    super(props)

    this.initialState = {
      significantWaveHeight: props.document.env.wave.significantWaveHeight,
    }

    this.state = this.initialState
  }

  handleChange = (event) => {
    console.log('** handling change ...')

    const { name, value } = event.target

    this.setState({
      [name]: value,
    })
  }

  submitForm = () => {
    console.log('** submitting ...')
    this.props.document.env.wave.significantWaveHeight = this.state.significantWaveHeight
    this.props.updateEntity(this.props.document)
    //this.props.handleSubmit(this.state)
  }

  render() {
    const state = this.state

    return (
      <form>
        <label>significantWaveHeight : </label>
        <input
          type="text"
          name="significantWaveHeight"
          value={state.significantWaveHeight}
          onChange={this.handleChange}
        />
        <Button variant="contained" color="primary" onClick={this.submitForm}>
          Submit
        </Button>
      </form>
    )
  }
}
//****************************************************** */
class Form extends Component {
  constructor(props) {
    super(props)
    this.props = props

    this.entityEnv = new Entity({ document: props.document.env })
    this.entityMoor = new Entity({ document: props.document.mooring })
  }

  handleChange = (event) => {
    const { id, value } = event.target
    this.props.document[id] = value
  }

  updateDoc = () => {
    console.log('** updating document')
    console.log(this.entityEnv.document)
    console.log(this.entityMoor.document)

    this.props.document.env = this.entityEnv.document
    this.props.document.mooring = this.entityMoor.document

    console.log(this.props.document)

    this.props.updateEntity(this.props.document)
  }

  render() {
    return (
      <form>
        <Box width="60%">
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
          <DocForm entity={this.entityEnv} />
          <Box m={2} />
          <DocForm entity={this.entityMoor} />
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

const sceForm = ({ updateEntity, document }) => {
  return (
    <div>
      <Form document={document} updateEntity={updateEntity} />
    </div>
  )
}

//********************************************************//
//********************************************************//

export { sceForm as SRSSceForm }
