import React from 'react'
import TreeNode from '../TreeNode'
// @ts-ignore
import TestRenderer from 'react-test-renderer'
import { TreeNodeData } from '../Tree'
import { IndexNode } from '../../../api/Api'
import { NodeType } from '../../../api/types'

describe('TreeNode', () => {
  it.skip('renders without crashing', () => {
    const props = {
      nodeId: 'node_0',
      dispatch: () => {},
      NodeRenderer: (node: TreeNodeData) => {
        return <h2>{node.title}</h2>
      },
      nodes: {
        node_0: {
          nodeId: 'node_0',
          nodeType: NodeType.rootPackage,
          title: 'node_0',
          isRoot: true,
          isOpen: true,
        },
      },
      level: 0,
      onToggle: (node: IndexNode) => {},
    }

    const testRenderer = TestRenderer.create(<TreeNode {...props} />)
    const testInstance = testRenderer.root

    expect(testInstance.findByType('h2').props.children).toBe('node_0')
  })
})
