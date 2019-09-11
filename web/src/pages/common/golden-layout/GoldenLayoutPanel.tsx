import React from 'react'

class GoldenLayoutPanel extends React.Component<any, any> {
  constructor(props: any) {
    super(props)

    this.setProps = this.setProps.bind(this)
  }

  state = {
    globalState: {},
  }

  componentWillMount() {
    this.props.glEventHub.on('props-updated', this.setProps)
  }

  componentWillUnmount() {
    this.props.glEventHub.off('props-updated', this.setProps)
  }

  setProps(globalState: any) {
    this.setState(globalState)
  }

  render() {
    const { children } = this.props

    const props = {
      ...this.props,
      globalState: this.state.globalState,
    }

    return (
      <>
        <div>
          {React.Children.map(children, (child: any) => {
            return React.cloneElement(child, props)
          })}
        </div>
      </>
    )
  }
}

export default GoldenLayoutPanel
