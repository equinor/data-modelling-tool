import React from 'react'
import Tree, { TreeData } from '../Tree'
// @ts-ignore
import TestRenderer from 'react-test-renderer'

describe('Tree', () => {
  it('renders without crashing', () => {
    const tree = {
      folder: {
        path: 'folder',
        type: 'folder',
        //isOpen: false,
        title: 'folder',
        isRoot: true,
      },
      'folder/file': {
        path: 'folder/file',
        type: 'file',
        //isOpen: false,
        title: 'file',
        isRoot: true,
      },
    }
    const testRenderer = TestRenderer.create(
      <Tree tree={tree} onToggle={() => {}}>
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

    expect(testInstance.findByType('h3').props.children).toBe('file')
    expect(testInstance.findByType('h2').props.children).toBe('folder')
  })
})
