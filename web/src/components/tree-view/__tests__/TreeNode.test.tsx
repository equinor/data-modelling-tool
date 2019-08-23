import React from 'react'
import TreeNode from '../TreeNode'
// @ts-ignore
import TestRenderer from 'react-test-renderer'
import { TreeNodeData } from '../Tree'
import { NodeType } from '../TreeReducer'

describe('TreeNode', () => {
  it('renders without crashing', () => {
    const node = {
      nodeId: 'node_0',
      type: NodeType.folder,
      title: 'node_0',
      isRoot: true,
      isOpen: true,
    }
    const props = {
      node: node,
      dispatch: () => {},
      NodeRenderer: (node: TreeNodeData) => {
        return <h2>{node.title}</h2>
      },
      nodes: {
        node_0: node,
      },
      level: 0,
      onToggle: (node: TreeNodeData) => {},
      onNodeSelect: (node: TreeNodeData) => {},
    }

    const testRenderer = TestRenderer.create(<TreeNode {...props} />)
    const testInstance = testRenderer.root

    expect(testInstance.findByType('h2').props.children).toBe('node_0')
  })
})
