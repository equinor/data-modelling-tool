import React from 'react'
import WithContextMenu from '../context-menu-actions/WithContextMenu'
import { LayoutContext } from '../golden-layout/LayoutContext'
import { TreeNodeRenderProps } from '../../../components/tree-view/TreeNode'
import { NodeType } from '../../../util/variables'
import { createNodes } from '../context-menu-actions/ContextMenuActionsFactory'

interface DocumentNodeProps {
  node: TreeNodeRenderProps
}

function documentOnClick({ layout, onSelect, node }: any) {
  layout.add(onSelect.uid, onSelect.title, onSelect.component, onSelect.data)
  layout.focus(node.nodeData.nodeId)
}

export function packageOnClick({ onSelect, node }: any) {
  // Don't fetch index when closing a folder
  if (!node.nodeData.isOpen) {
    createNodes({
      documentId: node.nodeData.nodeId,
      nodeUrl: onSelect,
      node: node,
    })
  }
}

export const DocumentNode = (props: DocumentNodeProps) => {
  const { node } = props
  const { nodeData } = node
  const { meta } = nodeData
  const { onSelect } = meta as any
  let onClick: Function
  if (node.nodeData.nodeType === NodeType.PACKAGE) {
    onClick = packageOnClick
  } else {
    onClick = documentOnClick
  }

  return (
    <LayoutContext.Consumer>
      {(layout: any) => {
        let dataUrl = ''
        if (node?.nodeData?.meta?.onSelect?.data) {
          //@ts-ignore
          dataUrl = node.nodeData.meta.onSelect.data.dataUrl
        }
        return (
          <WithContextMenu node={node} layout={layout} dataUrl={dataUrl}>
            {!onSelect && (
              <div>
                {nodeData.title}
                {meta.error && (
                  <small style={{ paddingLeft: '15px' }}>
                    An error occurred...
                  </small>
                )}
              </div>
            )}
            {onSelect && (
              <div onClick={() => onClick({ layout, onSelect, node })}>
                {nodeData.title}
                {meta.error && (
                  <small style={{ paddingLeft: '15px' }}>
                    An error occurred...
                  </small>
                )}
              </div>
            )}
          </WithContextMenu>
        )
      }}
    </LayoutContext.Consumer>
  )
}
