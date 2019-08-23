import { GenerateTreeview } from '../generateTreeview'

describe('generate treeview', () => {
  it('should add root-node', () => {
    const newNodes = new GenerateTreeview({}).addRootNode('local-files').build()

    expect(newNodes).toMatchObject({
      'local-files': {
        isRoot: true,
        title: 'local-files',
        nodeId: 'local-files',
        children: [],
      },
    })
  })

  it('should add package', () => {
    const currentNodes = {
      'local-files': {
        isRoot: true,
        title: 'local-files',
        nodeId: 'local-files',
        children: [],
      },
    }

    const index = [
      {
        _id: '1.0.0/big-propeller.json',
      },
      {
        _id: '1.0.0/package.json',
      },
    ]
    const newNodes = new GenerateTreeview(currentNodes)
      .addNodes(index, 'local-files')
      .build()
    expect(newNodes).toMatchObject({
      'local-files': {
        children: ['local-files/1.0.0'],
      },
      'local-files/1.0.0': {
        isRoot: false,
        type: 'folder',
        children: ['local-files/1.0.0/big-propeller.json'],
      },
    })
  })
})
