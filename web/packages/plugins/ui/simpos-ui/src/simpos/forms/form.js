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

import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'

import { Entity } from './entity.js'
import { DocForm } from './docForm.js'
//****************************************************** */
class Form extends Component {
  constructor(props) {
    super(props)
    this.props = props
    this.document = null
    this.entity = new Entity({ document: props.document })
  }

  updateDoc = () => {
    console.log('** updating document')
    console.log(this.entity)

    this.document = { ...this.entity.document }

    console.log(this.document)

    this.props.updateEntity(this.document)
  }

  render() {
    return (
      <form>
        <Box width="100%">
          <DocForm entity={this.entity} />
          <Box m={5} />
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

//********************************************************//
//********************************************************//

export { Form }
