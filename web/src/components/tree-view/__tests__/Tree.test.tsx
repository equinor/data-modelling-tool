import React from 'react'
import Tree, { TreeNodeData } from '../Tree'
// @ts-ignore
import TestRenderer from 'react-test-renderer'
import { IndexNode } from '../../../api/Api'

describe('Tree', () => {
  it('renders without crashing', () => {
    const tree = {
      node_0: {
        _id: 'node_0',
        nodeType: 'root-package',
        title: 'node_0',
        isRoot: true,
        children: ['node_1'],
      },
      node_1: {
        _id: 'node_1',
        nodeType: 'file',
        title: 'node_1',
      },
    }
    const testRenderer = TestRenderer.create(
      <Tree tree={tree}>
        {(node: IndexNode) => {
          console.log(node)
          if (node.nodeType === 'root-package') {
            return <h2>{node.title}</h2>
          }
          if (node.nodeType === 'file') {
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
