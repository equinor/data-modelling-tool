import React from 'react'
import TreeNode, { TreeNodeProps, TreeNodeRenderProps } from '../TreeNode'
// @ts-ignore
import TestRenderer from 'react-test-renderer'
import { NodeIconType, TreeNodeData } from '../Tree'
import { NodeType } from '../../../utils/variables'

describe('TreeNode', () => {
  it('renders without crashing', () => {
    const props: TreeNodeProps = {
      node: {
        nodeId: 'node_0',
        nodeType: NodeType.BLUEPRINT,
        title: 'node_0',
        isRoot: true,
        isOpen: true,
        isExpandable: true,
        isFolder: true,
        icon: NodeIconType.folder,
        meta: {},
        isLoading: false,
      },
      NodeRenderer: (props: TreeNodeRenderProps) => {
        return <h2>{props.nodeData.title}</h2>
      },
      actions: {
        updateNode: () => {},
        addNode: () => {},
        replaceNode: () => {},
        removeNode: () => {},
        addChild: () => {},
        addNodes: () => {},
        hasChild: () => {
          return true
        },
      },
      handleToggle: () => {},
      level: 0,
      path: '',
      parent: '',
    }

    const testRenderer = TestRenderer.create(<TreeNode {...props} />)
    const testInstance = testRenderer.root

    expect(testInstance.findByType('h2').props.children).toBe('node_0')
  })
})
