import React, { useState } from 'react'
import WithContextMenu from '../context-menu-actions/WithContextMenu'
import { LayoutContext } from '../golden-layout/LayoutContext'
import { CreateNodes } from '../context-menu-actions/ContextMenuActionsFactory'

export function treeNodeClick({
  layout,
  node,
  setLoading,
  fetchUrl,
  indexUrl,
}: any) {
  if (fetchUrl) {
    layout.add(fetchUrl.uid, fetchUrl.title, fetchUrl.component, fetchUrl.data)
    layout.focus(node.nodeData.nodeId)
  }
  if (indexUrl) {
    // Don't fetch index when closing a node
    if (!node.nodeData.isOpen) {
      setLoading(true)
      CreateNodes({
        documentId: node.nodeData.nodeId,
        nodeUrl: indexUrl,
        node: node,
        loadingCallBack: setLoading,
      })
    }
  }
}

export const DocumentNode = (props: any) => {
  const node = { ...props.node }
  const meta = { ...node.nodeData.meta }
  const [loading, setLoading] = useState(false)

  const onClick = (layout: any) => {
    node.handleToggle(node.nodeData)
    treeNodeClick({
      layout,
      fetchUrl: meta.fetchUrl,
      indexUrl: meta.indexUrl,
      node,
      setLoading,
    })
  }

  return (
    <LayoutContext.Consumer>
      {(layout: any) => {
        return (
          <WithContextMenu node={node} layout={layout}>
            <div
              style={{ display: 'flex', flexDirection: 'row' }}
              onClick={() => onClick(layout)}
            >
              {node.iconGroup(() => onClick(layout))}
              {node.nodeData.title}
              {loading && (
                <small style={{ paddingLeft: '15px' }}>Loading...</small>
              )}
              {node.nodeData.error && (
                <small style={{ paddingLeft: '15px' }}>
                  An error occurred...
                </small>
              )}
            </div>
          </WithContextMenu>
        )
      }}
    </LayoutContext.Consumer>
  )
}
