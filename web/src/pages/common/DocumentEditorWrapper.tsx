import React, { useState } from 'react'
import { Col, Grid, Row } from 'react-styled-flexboxgrid'
import { GoldenLayoutComponent } from './golden-layout/GoldenLayoutComponent'
import GoldenLayoutPanel from './golden-layout/GoldenLayoutPanel'
import DocumentComponent from './layout-components/DocumentComponent'
import { LayoutComponents, LayoutProvider } from './golden-layout/LayoutContext'

function wrapComponent(Component: any, state: any) {
  class Wrapped extends React.Component {
    render() {
      return (
        <GoldenLayoutPanel {...this.props} state={state}>
          <Component />
        </GoldenLayoutPanel>
      )
    }
  }

  return Wrapped
}

export default (props: any) => {
  // TODO:
  //  Create global state for golden layout.
  //  Here should list of open files be e.g...
  //  This can be done using consumer and provider context, passing props, using the layout manager event bus.
  const state = null

  const [layout, setLayout] = useState({ myLayout: null })

  return (
    <LayoutProvider layout={layout}>
      <Grid fluid>
        <Row>
          {layout && (
            <Col xs={12} md={12} lg={3}>
              {props.children}
            </Col>
          )}
          <Col xs={12} md={12} lg={9}>
            <GoldenLayoutComponent
              globalState={state}
              htmlAttrs={{ style: { height: '100vh' } }}
              config={{
                dimensions: {
                  headerHeight: 46,
                },
                content: [
                  {
                    type: 'stack',
                    isClosable: false,
                  },
                ],
              }}
              registerComponents={(myLayout: any) => {
                setLayout({ myLayout })
                myLayout.registerComponent(
                  LayoutComponents.blueprint,
                  wrapComponent(DocumentComponent, state)
                )
              }}
            />
          </Col>
        </Row>
      </Grid>
    </LayoutProvider>
  )
}
