import React from 'react'
import {
  LayoutComponents,
  LayoutContext,
} from '../../common/golden-layout/LayoutContext'
import { RenderProps } from '../../common/tree-view/DocumentTree'

export const DocumentRefNode = (props: RenderProps) => {
  const { treeNodeData } = props

  const [dataSourceId, nodeId] = treeNodeData.nodeId.split('/')
  const [selectedDocumentId, attribute] = nodeId.split('_')

  return (
    <LayoutContext.Consumer>
      {(layout: any) => {
        const data = {
          dataSourceId: dataSourceId,
          selectedDocumentId: selectedDocumentId,
          attribute: attribute,
          templateRef: treeNodeData.templateRef,
        }
        return (
          <div
            onClick={() =>
              layout.add(
                treeNodeData.nodeId,
                treeNodeData.title,
                LayoutComponents.ref,
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
