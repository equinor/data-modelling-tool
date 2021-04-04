// @ts-nocheck
import React from 'react'

class GoldenLayoutPanel extends React.Component<any, any> {
  constructor(props: any) {
    super(props)

    this.setProps = this.setProps.bind(this)
    this.propsUpdated = this.propsUpdated.bind(this)
  }

  state = {
    globalState: {},
    updates: 1,
  }

  componentDidMount() {
    this.props.glEventHub.on('props-updated', this.propsUpdated)
  }

  propsUpdated(id: any) {
    const { glContainer } = this.props
    // @ts-ignore
    if (glContainer['_config'].id === id) {
      this.setState({ updates: this.state.updates + 1 })
      this.forceUpdate()
    }
  }

  // componentWillUnmount() {
  //   this.props.glEventHub.off('props-updated', this.setProps)
  // }

  setProps(globalState: any) {
    this.setState(globalState)
  }

  render() {
    const { children } = this.props

    const props = {
      ...this.props,
      updates: this.state.updates,
    }

    return (
      <>
        {React.Children.map(children, (child: any) => {
          return React.cloneElement(child, props)
        })}
      </>
    )
  }
}

export default GoldenLayoutPanel
