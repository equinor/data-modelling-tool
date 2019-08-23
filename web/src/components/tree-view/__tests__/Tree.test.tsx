import React from 'react'
import Tree, { TreeData } from '../Tree'
// @ts-ignore
import TestRenderer from 'react-test-renderer'

describe('Tree', () => {
  it('renders without crashing', () => {
    const tree = {
      node_0: {
        nodeId: 'node_0',
        type: 'folder',
        title: 'node_0',
        isRoot: true,
      },
      node_1: {
        nodeId: 'node_1',
        type: 'file',
        title: 'node_1',
        isRoot: true,
      },
    }
    const testRenderer = TestRenderer.create(
      <Tree tree={tree}>
        {(node: TreeData) => {
          if (node.type === 'folder') {
            return <h2>{node.title}</h2>
          }
          if (node.type === 'file') {
            return <h3>{node.title}</h3>
          }
        }}
      </Tree>
    )
    const testInstance = testRenderer.root

    expect(testInstance.findByType('h2').props.children).toBe('node_0')
    expect(testInstance.findByType('h3').props.children).toBe('node_1')
  })
})
