import React from 'react'
import { TreeNodeData } from '../../../components/tree-view/Tree'
import {
  LayoutComponents,
  LayoutContext,
} from '../../common/golden-layout/LayoutContext'

type Props = {
  treeNodeData: TreeNodeData
}

export const BlueprintNode = (props: Props) => {
  const { treeNodeData } = props

  return (
    <LayoutContext.Consumer>
      {(layout: any) => {
        const data = {
          selectedDocumentId: treeNodeData.nodeId,
        }
        return (
          <div
            onClick={() =>
              layout.add(
                treeNodeData.nodeId,
                treeNodeData.title,
                LayoutComponents.blueprint,
                data
              )
            }
          >
            {treeNodeData.title}
          </div>
        )
      }}
    </LayoutContext.Consumer>
  )
}
