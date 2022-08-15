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

//table
import styled from 'styled-components'

import { EntityParser } from '../../dmt/tools/EntityParser.js'

//****************************************************** */
//collapsable sections
//import { useState } from 'react'
//import useCollapse from 'react-collapsed'

//import { FaChevronDown, FaChevronRight } from 'react-icons/fa'

//import Button from '@material-ui/core/Button'
//import Divider from '@material-ui/core/Divider'

//****************************************************** */

//import ExpansionPanel from '@material-ui/core/ExpansionPanel';
//import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
//import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import ExpansionPanel from '@material-ui/core/Accordion'
import ExpansionPanelSummary from '@material-ui/core/AccordionSummary'
import ExpansionPanelDetails from '@material-ui/core/AccordionDetails'

//****************************************************** */

import Container from '@material-ui/core/Container'
import TextField from '@material-ui/core/TextField'
import { withStyles } from '@material-ui/core/styles'
import { makeStyles } from '@material-ui/core/styles'

import Grid from '@material-ui/core/Grid'

import Tooltip from '@material-ui/core/Tooltip'
import Box from '@material-ui/core/Box'

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 12,
  },
}))(Tooltip)

//****************************************************** */

//collapsable style

const Wrapper = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 2px;
`

const Toggle = styled.div`
  background-color: #f4f4f4;
  color: #444;
  cursor: pointer;
  padding: 8px;
  width: 100%;
  text-align: left;
  border: none;
`

const Content = styled.div`
  padding: 12px;
  animation: fadein 0.3s ease-in;
`
const Icons = styled.span`
  margin-right: 6px;
`
//****************************************************** */
const StyledExpansionPanel = withStyles({
  root: {
    width: '100%',
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(ExpansionPanel)

const StyledExpansionPanelSummary = withStyles({
  root: {
    backgroundColor: 'rgba(0, 0, 255, 0.05)',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 44,
    '&$expanded': {
      minHeight: 44,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(ExpansionPanelSummary)

const StyledExpansionPanelDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
    flexDirection: 'column',
  },
}))(ExpansionPanelDetails)
//****************************************************** */

const specialProps = ['name', 'type', 'description', 'label', '_id']

const parser = new EntityParser()
//********************************************************//

//********************************************************//
class SectionView extends Component {
  constructor(props) {
    super(props)

    this.entity = props.entity
    this.doc = props.doc
    this.keyInd = props.keyInd

    this.parents = props.parents

    this.initialState = { ...props.doc }
    this.state = this.initialState

    this.errState = ''

    this.objects = []
    this.simples = []

    this.parseDoc()
  }

  parseDoc = () => {
    this.objects = []
    this.simples = []
    this.atomicArrays = []
    var index = 0

    for (var prop in this.doc) {
      if (parser.isObject(this.doc[prop])) {
        //this is an object
        if (
          parser.isOfType(this.doc[prop], 'DimensionalScalar') ||
          parser.isOfType(this.doc[prop], 'SimpleString')
        ) {
          //this is a special object, to be compacted as simple

          //log console.log('**dimensional scalar')
          //log console.log(this.doc[prop].type)

          this.simples.push(this.DimensionalScalarToForm(prop, index))
        } else {
          this.objects.push(this.ObjectToForm(prop, index))
        }
        index = index + 1
      } else {
        if (specialProps.indexOf(prop) == -1) {
          this.simples.push(this.SimpleToForm(prop, index))
          index = index + 1
        }
      }
    }

    //console.log(this.simples)
  }

  // isObject = prop => {
  //   if (typeof this.doc[prop] === 'object' && this.doc[prop] !== null) {
  //     return true
  //   }

  //   return false
  // }

  // isDimensionalScalar = prop => {
  //   console.log('------------- checking type, isDimensionalScalar')
  //   if (this.isObject(prop)) {
  //   console.log(this.doc[prop].type)
  //   console.log(this.doc[prop].type.indexOf('DimensionalScalar') != -1)
  //     if (this.doc[prop].type.indexOf('DimensionalScalar') != -1) {
  //       return true
  //     }
  //   } else {
  //     return false
  //   }
  // }

  handleChange = (event) => {
    console.log('** handling change ...')

    const { id, value, defaultValue } = event.target

    //var fieldType = this.guessType(defaultValue);

    //console.log(fieldType)
    var validInput = true

    // if (fieldType == 'number') {
    //   var pattern = /^-?\d+\.?\d*$/;
    //   if (! pattern.test(value)) {
    //     validInput = false;
    //     this.errState = "is not a number";
    //   }
    // }

    //event.target.error = (this.errState[id].length === 0) ? false : true;
    //event.target.helperText= this.errState[id];

    // console.log(this.errState)

    var chValue = value

    if (validInput) {
      if (
        parser.isOfType(this.doc[id], 'DimensionalScalar') ||
        parser.isOfType(this.doc[id], 'SimpleString')
      ) {
        if (parser.isOfType(this.doc[id], 'DimensionalScalar'))
          chValue = Number(chValue)

        this.state[id].value = chValue
        var parents = this.parents.slice()
        parents.push(id)
        this.entity.handleChange(parents, { id: 'value', value: chValue })
      } else {
        this.state[id] = value
        if (this.guessType(chValue) === 'number') chValue = Number(chValue)
        this.entity.handleChange(this.parents, { id: id, value: chValue })
      }
    }
  }

  guessType = (val) => {
    if (isNaN(val)) {
      if (val.indexOf(',') == -1) {
        return 'string'
      } else {
        return 'string'
      }
    } else {
      return 'number'
    }
  }
  DimensionalScalarToForm = (prop, index) => {
    //console.log('** reading items ' + prop)
    //console.log(this.doc)

    //let prop = env.wave[props[i]];

    //console.log('**** Making input box for : ' + prop)

    //this.errState = '';
    let inputBox = null

    //this is a special object, to be compacted as simple
    inputBox = (
      <Grid item xs key={index}>
        <LightTooltip
          title={this.doc[prop].description}
          placement="right-end"
          key={index}
        >
          <TextField
            id={prop}
            label={this.doc[prop].label}
            inputProps={{ style: { fontSize: 16 } }} // font size of input text
            InputLabelProps={{ style: { fontSize: 16 } }} // font size of input label
            variant="filled"
            //error ={this.errState.length === 0 ? false : true }
            //helperText= {this.errState}
            defaultValue={this.doc[prop].value}
            type={this.guessType(this.doc[prop].value)}
            onChange={this.handleChange}
          />
        </LightTooltip>
      </Grid>
    )

    return inputBox
  }
  SimpleToForm = (prop, index) => {
    //console.log('** reading items ' + prop)
    //console.log(this.doc)

    //let prop = env.wave[props[i]];

    //console.log('**** Making input box for : ' + prop)

    //this.errState = '';
    let inputBox = null
    inputBox = (
      <Grid item xs key={index}>
        <LightTooltip title={prop} placement="right-end" key={index}>
          <TextField
            id={prop}
            label={prop}
            inputProps={{ style: { fontSize: 16 } }} // font size of input text
            InputLabelProps={{ style: { fontSize: 16 } }} // font size of input label
            variant="filled"
            //error ={this.errState.length === 0 ? false : true }
            //helperText= {this.errState}
            defaultValue={this.doc[prop]}
            onChange={this.handleChange}
          />
        </LightTooltip>
      </Grid>
    )

    return inputBox
  }

  ObjectToForm = (prop, index) => {
    var parents = this.parents.slice()
    parents.push(prop)
    let segment = (
      // <Grid item xs key={index}>
      <SectionView
        entity={this.entity}
        doc={this.doc[prop]}
        keyInd={index}
        parents={parents}
        key={index}
      />
      // </Grid>
    )

    return segment
  }

  render() {
    let sectionTitle = ''
    if (this.doc.label != undefined) {
      sectionTitle = this.doc.label
    } else {
      sectionTitle = this.doc.name
    }

    return (
      <div>
        <StyledExpansionPanel defaultExpanded>
          <StyledExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1c-content"
            id="panel1c-header"
          >
            <Typography variant="h5">{sectionTitle}</Typography>
          </StyledExpansionPanelSummary>
          <StyledExpansionPanelDetails>
            <Grid container direction="row" spacing={1}>
              {this.simples.map((item, index) => item)}
            </Grid>
            <Box mt={1} />
            <div>{this.objects.map((item, index) => item)}</div>
          </StyledExpansionPanelDetails>
        </StyledExpansionPanel>
      </div>
    )
  }
}

const docForm = ({ entity, parents }) => {
  var parents = []

  return (
    <div>
      <SectionView
        entity={entity}
        doc={entity.document}
        keyInd={100}
        parents={parents}
      />
    </div>
  )
}

//********************************************************//
//********************************************************//

export { docForm as DocForm }
