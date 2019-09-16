import React from 'react'
import { TreeNodeData } from '../../../components/tree-view/Tree'
import {
  LayoutComponents,
  LayoutContext,
} from '../../common/golden-layout/LayoutContext'

type Props = {
  node: TreeNodeData
}

export const BlueprintNode = (props: Props) => {
  const { node } = props

  return (
    <LayoutContext.Consumer>
      {(layout: any) => {
        const data = {
          selectedDocumentId: node.nodeId,
        }
        return (
          <div
            onClick={() =>
              layout.add(
                node.nodeId,
                node.title,
                LayoutComponents.blueprint,
                data
              )
            }
          >
            {node.title}
          </div>
        )
      }}
    </LayoutContext.Consumer>
  )
}
