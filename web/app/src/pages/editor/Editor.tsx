import React from 'react'
import { Col, Grid, Row } from 'react-styled-flexboxgrid'
import DocumentComponent from './layout-components/DocumentComponent'
import Header from '../../components/Header'
import {
  IDashboard,
  useDashboard,
} from '../../context/dashboard/DashboardProvider'
import IndexProvider from '../../context/global-index/IndexProvider'
import { LayoutComponents } from '../../context/dashboard/useLayout'
import { ModalProvider } from '../../context/modal/ModalContext'
import DocumentExplorer from './document-explorer/DocumentExplorer'
import { GoldenLayoutComponent } from '../../components/golden-layout/GoldenLayoutComponent'
import GoldenLayoutPanel from '../../components/golden-layout/GoldenLayoutPanel'
import AddDatasource from './data-source/AddDatasource'
import styled from 'styled-components'
import { IndexAPI } from '@dmt/common'

export const Wrapper = styled.div`
  width: 100%;
  padding-right: 20px;
`

function wrapComponent(Component: any) {
  class Wrapped extends React.Component {
    render() {
      return (
        <GoldenLayoutPanel {...this.props}>
          <Component />
        </GoldenLayoutPanel>
      )
    }
  }

  return Wrapped
}

const LAYOUT_CONFIG = {
  dimensions: {
    headerHeight: 46,
  },
  content: [
    {
      type: 'stack',
      isClosable: false,
    },
  ],
}

const indexAPI = new IndexAPI()

export default () => {
  const dashboard: IDashboard = useDashboard()

  return (
    <IndexProvider
      indexApi={indexAPI}
      dataSources={dashboard.models.dataSources.models.dataSources}
      application={dashboard.models.application}
    >
      <ModalProvider>
        <Grid fluid>
          <Row>
            <Col xs={12} md={12} lg={3}>
              <Wrapper>
                <Header>
                  <AddDatasource />
                </Header>
                {dashboard.models.layout.models.layout.myLayout && (
                  <DocumentExplorer />
                )}
              </Wrapper>
            </Col>
            <Col xs={12} md={12} lg={9}>
              <GoldenLayoutComponent
                htmlAttrs={{ style: { height: '100vh' } }}
                config={LAYOUT_CONFIG}
                registerComponents={(myLayout: any) => {
                  myLayout.registerComponent(
                    LayoutComponents.blueprint,
                    wrapComponent(DocumentComponent)
                  )
                  dashboard.models.layout.operations.registerLayout({
                    myLayout,
                  })
                }}
              />
            </Col>
          </Row>
        </Grid>
      </ModalProvider>
    </IndexProvider>
  )
}
