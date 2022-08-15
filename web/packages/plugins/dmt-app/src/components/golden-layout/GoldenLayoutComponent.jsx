import React from 'react'
import ReactDOM from 'react-dom'
import './goldenLayout-dependencies'
import GoldenLayout from 'golden-layout'
import 'golden-layout/src/css/goldenlayout-base.css'
import 'golden-layout/src/css/goldenlayout-light-theme.css'
import $ from 'jquery'

export class GoldenLayoutComponent extends React.Component {
  state = {}
  containerRef = React.createRef()

  render() {
    let panels = Array.from(this.state.renderPanels || [])
    return (
      // eslint-disable-next-line react/prop-types
      <div ref={this.containerRef} {...this.props.htmlAttrs}>
        {panels.map(panel => {
          return ReactDOM.createPortal(
            panel._getReactComponent(),
            panel._container.getElement()[0]
          )
        })}
      </div>
    )
  }

  componentRender(reactComponentHandler) {
    this.setState(state => {
      let newRenderPanels = new Set(state.renderPanels)
      newRenderPanels.add(reactComponentHandler)
      return { renderPanels: newRenderPanels }
    })
  }
  componentDestroy(reactComponentHandler) {
    this.setState(state => {
      let newRenderPanels = new Set(state.renderPanels)
      newRenderPanels.delete(reactComponentHandler)
      return { renderPanels: newRenderPanels }
    })
  }

  componentDidUpdate(nextProps) {
    this.goldenLayoutInstance.eventHub.emit('props-updated', nextProps)
  }

  goldenLayoutInstance = undefined

  componentDidMount() {
    // eslint-disable-next-line react/prop-types
    this.goldenLayoutInstance = new GoldenLayout(
      // eslint-disable-next-line react/prop-types
      this.props.config || {},
      // eslint-disable-next-line react/prop-types
      this.containerRef.current
    )
    // eslint-disable-next-line react/prop-types
    if (this.props.registerComponents instanceof Function)
      // eslint-disable-next-line react/prop-types
      this.props.registerComponents(this.goldenLayoutInstance)
    this.goldenLayoutInstance.reactContainer = this
    this.goldenLayoutInstance.init()
    window.addEventListener('resize', () => {
      this.goldenLayoutInstance.updateSize()
    })
  }
}

//Patching internal GoldenLayout.__lm.utils.ReactComponentHandler:

const ReactComponentHandler = GoldenLayout['__lm'].utils.ReactComponentHandler

class ReactComponentHandlerPatched extends ReactComponentHandler {
  _render() {
    var reactContainer = this._container.layoutManager.reactContainer //Instance of GoldenLayoutComponent class
    if (reactContainer && reactContainer.componentRender)
      reactContainer.componentRender(this)
  }
  _destroy() {
    //ReactDOM.unmountComponentAtNode( this._container.getElement()[ 0 ] );
    this._container.off('open', this._render, this)
    this._container.off('destroy', this._destroy, this)
  }

  _getReactComponent() {
    //the following method is absolute copy of the original, provided to prevent depenency on window.React
    var defaultProps = {
      glEventHub: this._container.layoutManager.eventHub,
      glContainer: this._container,
    }
    var props = $.extend(defaultProps, this._container._config.props)
    return React.createElement(this._reactClass, props)
  }
}

GoldenLayout['__lm'].utils.ReactComponentHandler = ReactComponentHandlerPatched
