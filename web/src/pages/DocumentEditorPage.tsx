import React, { useState } from 'react'
import { Col, Grid, Row } from 'react-styled-flexboxgrid'
import styled from 'styled-components'
import { GoldenLayoutComponent } from './common/golden-layout/GoldenLayoutComponent'
import GoldenLayoutPanel from './common/golden-layout/GoldenLayoutPanel'
import Blueprint from './blueprints/blueprint/Blueprint'
import BlueprintsPage from './blueprints/BlueprintsPage'
import Tabs, { Tab, TabPanel, TabList } from '../components/Tabs'
import {
  LayoutComponents,
  LayoutProvider,
} from './common/golden-layout/LayoutContext'
import EntitiesPage from './entities/EntitiesPage'
import DocumentRef from './blueprints/blueprint/DocumentRef'

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

export default () => {
  // TODO:
  //  Create global state for golden layout.
  //  Here should list of open files be e.g...
  //  This can be done using consumer and provider context, passing props, using the layout manager event bus.
  const state = null

  const [layout, setLayout] = useState({ myLayout: null })

  return (
    <Grid fluid>
      <Row>
        {layout && (
          <Col xs={12} md={12} lg={3}>
            <Wrapper>
              <h4>Data Modelling Tool</h4>
              <Tabs>
                <TabList>
                  <Tab>Blueprints</Tab>
                  <Tab>Entities</Tab>
                </TabList>
                <TabPanel>
                  <LayoutProvider layout={layout}>
                    <BlueprintsPage />
                  </LayoutProvider>
                </TabPanel>
                <TabPanel>
                  <LayoutProvider layout={layout}>
                    <EntitiesPage />
                  </LayoutProvider>
                </TabPanel>
              </Tabs>
            </Wrapper>
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
                wrapComponent(Blueprint, state)
              )
              myLayout.registerComponent(
                LayoutComponents.entity,
                //@todo fix this
                wrapComponent(Blueprint, state)
              )
              myLayout.registerComponent(
                LayoutComponents.ref,
                wrapComponent(DocumentRef, state)
              )
            }}
          />
        </Col>
      </Row>
    </Grid>
  )
}

const Wrapper = styled.div`
  padding: 20px;
`
