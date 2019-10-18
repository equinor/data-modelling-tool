import React from 'react'
import WithContextMenu from '../context-menu-actions/WithContextMenu'
import { LayoutContext } from '../golden-layout/LayoutContext'
import { TreeNodeRenderProps } from '../../../components/tree-view/TreeNode'

interface DocumentNodeProps {
  node: TreeNodeRenderProps
}

export const DocumentNode = (props: DocumentNodeProps) => {
  const { node } = props
  const { nodeData } = node
  const { meta } = nodeData
  const { onSelect } = meta as any

  return (
    <LayoutContext.Consumer>
      {(layout: any) => {
        return (
          <WithContextMenu node={node} layout={layout}>
            {onSelect && (
              <div
                onClick={() =>
                  layout.add(
                    onSelect.uid,
                    onSelect.title,
                    onSelect.component,
                    onSelect.data
                  )
                }
              >
                {nodeData.title}
              </div>
            )}
          </WithContextMenu>
        )
      }}
    </LayoutContext.Consumer>
  )
}
