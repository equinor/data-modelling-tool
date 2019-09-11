import ViewBlueprintForm from './blueprint/ViewBlueprintForm'
import React from 'react'
import { PageMode } from '../common/DocumentReducer'
import EditBlueprintForm from './blueprint/EditBlueprintForm'
import CreateBlueprintForm from './blueprint/CreateBlueprintForm'
import styled from 'styled-components'

// <ViewBlueprintForm state={state} dispatch={dispatch} />

const Wrapper = styled.div`
  background-color: white;
  width: 100%;
  height: 100%;
  padding: 20px;
`

class BlueprintDetail extends React.Component<any, any> {
  constructor(props: any) {
    super(props)

    // This binding is necessary to make `this` work in the callback
    this.setProps = this.setProps.bind(this)
  }

  state = {
    globalState: {
      pageMode: 2,
    },
  }
  /*
    state = {
        value: this.props.value || "bla"
    };
    setValue = (e: any) => {
        this.setState({value: e.target.value});
    };

    setContainerTitle = () => {
        this.props.glContainer.setTitle(this.state.value);
    };*/

  componentWillReceiveProps(nextProps: any) {
    console.log(nextProps)
  }

  getDerivedStateFromProps(props: any, state: any) {
    console.log(props)
    console.log(state)
    this.setState(state)
  }

  componentWillMount() {
    console.log('componentWillMount')
    this.props.glEventHub.on('props-updated', this.setProps)
  }

  componentWillUnmount() {
    console.log('componentWillUnmount')
    this.props.glEventHub.off('props-updated', this.setProps)
  }

  setProps(globalState: any) {
    //this.setState(blueprintData);
    console.log(globalState)
    console.log('*************')
    this.setState(globalState)
  }

  render() {
    console.log(this.props)

    const { parentState, dispatch } = this.props

    const state = parentState

    const { globalState } = this.state

    if (state && dispatch && globalState) {
      const pageMode = globalState.pageMode
      return (
        <Wrapper>
          {pageMode === PageMode.view && state.selectedDocumentId && (
            <ViewBlueprintForm state={state} dispatch={dispatch} />
          )}
          {pageMode === PageMode.edit && state.selectedDocumentId && (
            <EditBlueprintForm state={state} dispatch={dispatch} />
          )}

          {pageMode === PageMode.create && state.selectedDocumentId && (
            <CreateBlueprintForm dispatch={dispatch} state={state} />
          )}
        </Wrapper>
      )
    } else {
      return <Wrapper />
    }
  }
}

export default BlueprintDetail
