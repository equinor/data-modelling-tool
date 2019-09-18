import React from 'react'
import TreeNode, { TreeNodeProps } from '../TreeNode'
// @ts-ignore
import TestRenderer from 'react-test-renderer'
import { TreeNodeData } from '../Tree'
import { NodeType } from '../../../api/types'

describe('TreeNode', () => {
  it('renders without crashing', () => {
    const props: TreeNodeProps = {
      node: {
        nodeId: 'node_0',
        nodeType: NodeType.rootPackage,
        title: 'node_0',
        isRoot: true,
        isOpen: true,
      },
      NodeRenderer: (node: TreeNodeData) => {
        return <h2>{node.title}</h2>
      },
      level: 0,
      updateNode: () => {},
      addNode: () => {},
      handleToggle: () => {},
    }

    const testRenderer = TestRenderer.create(<TreeNode {...props} />)
    const testInstance = testRenderer.root

    expect(testInstance.findByType('h2').props.children).toBe('node_0')
  })
})
