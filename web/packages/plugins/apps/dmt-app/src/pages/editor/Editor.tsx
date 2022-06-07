import React from 'react'
import {
  IDashboard,
  useDashboard,
} from '../../context/dashboard/DashboardProvider'
import { LayoutComponents } from '../../context/dashboard/useLayout'
import { ModalProvider } from '../../context/modal/ModalContext'
import { GoldenLayoutComponent } from '../../components/golden-layout/GoldenLayoutComponent'
import GoldenLayoutPanel from '../../components/golden-layout/GoldenLayoutPanel'
import styled from 'styled-components'
import { TreeNode, TreeView, UIPluginSelector } from '@dmt/common'
import { NodeRightClickMenu } from '../../components/context-menu/ContextMenu'
//@ts-ignore
import { NotificationManager } from 'react-notifications'

export const TreeWrapper = styled.div`
  width: 25%;
  min-width: 15vw;
  padding-left: 15px;
  padding-top: 15px;
  height: 100vh;
  border-right: black solid 1px;
  border-radius: 2px;
`

function wrapComponent(Component: any) {
  class Wrapped extends React.Component {
    render() {
      return (
        // @ts-ignore
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
      isClosable: true,
    },
  ],
}

export default () => {
  const dashboard: IDashboard = useDashboard()

  const open = (node: TreeNode) => {
    if (Array.isArray(node.entity)) {
      return
    }
    dashboard.models.layout.operations.add(
      node.nodeId,
      node?.name || 'None',
      LayoutComponents.blueprint,
      {
        absoluteDottedId: node.nodeId,
        entity: node.entity,
      }
    )
    dashboard.models.layout.operations.focus(node.nodeId)
  }

  return (
    <ModalProvider>
      <div style={{ display: 'flex' }}>
        <TreeWrapper>
          <TreeView
            onSelect={(node: TreeNode) => open(node)}
            // @ts-ignore
            NodeWrapper={NodeRightClickMenu}
          />
        </TreeWrapper>
        {/*@ts-ignore*/}
        <GoldenLayoutComponent
          htmlAttrs={{ style: { height: '100vh', width: '100%' } }}
          config={LAYOUT_CONFIG}
          registerComponents={(myLayout: any) => {
            myLayout.registerComponent(
              LayoutComponents.blueprint,
              wrapComponent(UIPluginSelector)
            )
            dashboard.models.layout.operations.registerLayout({
              myLayout,
            })
          }}
        />
      </div>
    </ModalProvider>
  )
}
