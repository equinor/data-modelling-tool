import React, { useContext } from 'react'
import {
  IDashboard,
  useDashboard,
} from '../../context/dashboard/DashboardProvider'
import { ELayoutComponents } from '../../context/dashboard/useLayout'
import { ModalProvider } from '../../context/modal/ModalContext'
import { GoldenLayoutComponent } from '../../components/golden-layout/GoldenLayoutComponent'
import GoldenLayoutPanel from '../../components/golden-layout/GoldenLayoutPanel'
import styled from 'styled-components'
import {
  FSTreeContext,
  TreeNode,
  TreeView,
  UIPluginSelector,
} from '@development-framework/dm-core'
import { NodeRightClickMenu } from '../../components/context-menu/ContextMenu'

import { Progress } from '@equinor/eds-core-react'

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

export default () => {
  const dashboard: IDashboard = useDashboard()
  const { treeNodes, loading } = useContext(FSTreeContext)

  const open = (node: TreeNode) => {
    if (Array.isArray(node.entity)) {
      return
    }
    dashboard.models.layout.operations.add(
      node.nodeId,
      node?.name || 'None',
      ELayoutComponents.blueprint,
      {
        absoluteDottedId: node.nodeId,
        type: node.entity.type,
      }
    )
    dashboard.models.layout.operations.focus(node.nodeId)
  }

  return (
    <ModalProvider>
      <div style={{ display: 'flex' }}>
        <TreeWrapper>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Progress.Circular />
            </div>
          ) : (
            <TreeView
              nodes={treeNodes}
              onSelect={(node: TreeNode) => open(node)}
              // @ts-ignore
              NodeWrapper={NodeRightClickMenu}
            />
          )}
        </TreeWrapper>
        <GoldenLayoutComponent
          htmlAttrs={{ style: { height: '100vh', width: '100%' } }}
          config={LAYOUT_CONFIG}
          registerComponents={(myLayout: any) => {
            myLayout.registerComponent(
              ELayoutComponents.blueprint,
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
