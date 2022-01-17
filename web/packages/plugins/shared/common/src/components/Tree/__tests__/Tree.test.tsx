import React from 'react'
import { Tree, TreeNodeData } from '../Tree'
// @ts-ignore
import TestRenderer from 'react-test-renderer'
import { IndexNode } from '../../../services'
import { NodeType } from '../../../utils/variables'

describe('Tree', () => {
  it.skip('renders without crashing', () => {
    const tree = {
      node_0: {
        _id: 'node_0',
        nodeType: NodeType.PACKAGE,
        title: 'node_0',
        isRoot: true,
        children: ['node_1'],
      },
      node_1: {
        _id: 'node_1',
        nodeType: NodeType.DOCUMENT_NODE,
        title: 'node_1',
      },
    }
    const testRenderer = TestRenderer.create(
      // @ts-ignore
      <Tree tree={tree}>
        {(node: IndexNode) => {
          if (node.nodeType === NodeType.PACKAGE) {
            return <h2>{node.title}</h2>
          }
          if (node.nodeType === NodeType.DOCUMENT_NODE) {
            return <h3>{node.title}</h3>
          }
          return null
        }}
      </Tree>
    )
    const testInstance = testRenderer.root

    expect(testInstance.findByType('h2').props.children).toBe('node_0')
    // expect(testInstance.findByType('h3').props.children).toBe('node_1')
  })
})
