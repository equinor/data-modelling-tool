import React from 'react'
import WithContextMenu from '../context-menu-actions/WithContextMenu'
import { LayoutContext } from '../golden-layout/LayoutContext'
import { TreeNodeRenderProps } from '../../../components/tree-view/TreeNode'
import * as _ from 'lodash'

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
        let dataUrl = ''
        if (_.get(node, 'nodeData.meta.onSelect.data')) {
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
              <div
                onClick={() => {
                  layout.add(
                    onSelect.uid,
                    onSelect.title,
                    onSelect.component,
                    // pass data object which holds context for this layout item.
                    {...onSelect.data, node},
                  )
                  layout.focus(node.nodeData.nodeId)
                }}
              >
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
