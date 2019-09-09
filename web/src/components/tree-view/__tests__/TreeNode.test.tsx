import React from 'react'
import TreeNode from '../TreeNode'
// @ts-ignore
import TestRenderer from 'react-test-renderer'
import { TreeNodeData } from '../Tree'
import { NodeType } from '../TreeReducer'
import { IndexNode } from '../../../api/Api'

describe('TreeNode', () => {
  it('renders without crashing', () => {
    const props = {
      onNodeSelect: () => {},
      NodeRenderer: (node: TreeNodeData) => {
        return <h2>{node.title}</h2>
      },
      node: {
        nodeId: 'node_0',
        nodeType: NodeType.folder,
        title: 'node_0',
        isRoot: true,
        isOpen: true,
      },
      level: 0,
    }

    const testRenderer = TestRenderer.create(<TreeNode {...props} />)
    const testInstance = testRenderer.root
    expect(testInstance.findByType('h2').props.children).toBe('node_0')
  })
})
