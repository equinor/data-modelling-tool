import React from 'react'
import TreeNode, { TreeNodeProps } from '../TreeNode'
// @ts-ignore
import TestRenderer from 'react-test-renderer'
import { NodeType } from '../../../api/types'
import { NodeIconType, TreeNodeData } from '../types'

describe('TreeNode', () => {
  it('renders without crashing', () => {
    const props: TreeNodeProps = {
      node: {
        nodeId: 'node_0',
        nodeType: NodeType.rootPackage,
        title: 'node_0',
        isRoot: true,
        isOpen: true,
        isExpandable: true,
        isFolder: true,
      },
      NodeRenderer: (path, parent, node: TreeNodeData) => {
        return <h2>{node.title}</h2>
      },
      level: 0,
      updateNode: () => {},
      addNode: () => {},
      handleToggle: () => {},
      replaceNode: () => {},
      removeNode: () => {},
      path: '',
      parent: '',
    }

    const testRenderer = TestRenderer.create(<TreeNode {...props} />)
    const testInstance = testRenderer.root

    expect(testInstance.findByType('h2').props.children).toBe('node_0')
  })
})
