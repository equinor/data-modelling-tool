import { generateTreeview, TreeviewIndex } from '../generateTreeview'

describe('Generate Treeview', () => {
  it('should generate treeview', () => {
    const templatesIndex: TreeviewIndex[] = [
      {
        path: '/geometries/box/box-blueprint.json',
        title: 'Box Blueprint',
      },
      {
        path: '/root/simos-blueprint.json',
        title: 'Simos Blueprint Template',
      },
    ]
    expect(generateTreeview(templatesIndex, 'api/templates')).toMatchObject({
      '/geometries': {
        path: '/geometries',
        type: 'folder',
        isRoot: true,
        children: ['/geometries/box'],
      },
      '/geometries/box': {
        path: '/geometries/box',
        type: 'folder',
        children: ['/geometries/box/box-blueprint.json'],
      },
      '/geometries/box/box-blueprint.json': {
        title: 'Box Blueprint',
        path: '/geometries/box/box-blueprint.json',
        type: 'file',
        endpoint: 'api/templates',
      },
      '/root': {
        path: '/root',
        type: 'folder',
        isRoot: true,
        children: ['/root/simos-blueprint.json'],
      },
      '/root/simos-blueprint.json': {
        title: 'Simos Blueprint Template',
        path: '/root/simos-blueprint.json',
        type: 'file',
        endpoint: 'api/templates',
      },
    })
  })
})
