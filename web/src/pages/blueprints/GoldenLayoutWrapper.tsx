import GoldenLayout from 'golden-layout'
import './goldenLayout-dependencies'
import React from 'react'
import BlueprintDetail from './BlueprintDetail'

class GoldenLayoutWrapper extends React.Component {
  private layout: any
  componentDidMount() {
    // Build basic golden-layout config
    const config = {
      content: [
        {
          type: 'row',
          content: [
            {
              type: 'react-component',
              component: 'BlueprintDetail',
            },
          ],
        },
      ],
    }

    function wrapComponent(Component: any) {
      class Wrapped extends React.Component {
        render() {
          return <Component {...this.props} />
        }
      }
      return Wrapped
    }

    var layout = new GoldenLayout(config, this.layout)
    layout.registerComponent('BlueprintDetail', wrapComponent(BlueprintDetail))
    /*
        layout.registerComponent('IncrementButtonContainer',
                                 wrapComponent(IncrementButtonContainer, this.context.store)
        );
        layout.registerComponent('DecrementButtonContainer',
                                 wrapComponent(DecrementButtonContainer, this.context.store)
        );
        layout.registerComponent('TestComponentContainer',
                                 wrapComponent(TestComponentContainer, this.context.store)
        );
         */
    layout.init()

    window.addEventListener('resize', () => {
      layout.updateSize()
    })
  }

  render() {
    return <div className="goldenLayout" ref={input => (this.layout = input)} />
  }
}

export default GoldenLayoutWrapper
