import { TreeViewUtil } from '../TreeviewUtil'
import { IndexNode } from '../generateTreeview'

describe('TreeviewUtil', () => {
  it('should sort nodes', () => {
    const nodes: IndexNode[] = [
      { _id: '1.0.0/propellers/propellers.json' },
      { _id: '1.0.0/propellers/package.json' },
    ]
    const sorted = nodes.sort(TreeViewUtil.sortNodes)
    expect(sorted[0]._id).toEqual('1.0.0/propellers/package.json')
    expect(sorted[1]._id).toEqual('1.0.0/propellers/propellers.json')
  })

  it('should get parentId from file', () => {
    const id = '1.0.0/propellers/propellers.json'
    expect(TreeViewUtil.getParentId(id)).toEqual('1.0.0/propellers')
  })

  it('should get parentId from subpackage', () => {
    const id = '1.0.0/propellers/package.json'
    expect(TreeViewUtil.getParentId(id)).toEqual('1.0.0/propellers')
  })

  it('should get id from package', () => {
    expect(
      TreeViewUtil.getId('1.0.0/propellers/package.json', 'local-file')
    ).toEqual('local-file/1.0.0/propellers')
  })

  it('should get id from file', () => {
    expect(
      TreeViewUtil.getId('1.0.0/propellers/propellers.json', 'local-file')
    ).toEqual('local-file/1.0.0/propellers/propellers.json')
  })
})
