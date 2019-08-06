import {
  generateRootPackageNodes,
  generateTreeViewNodes,
  TreeviewIndex,
} from '../generateTreeView'

describe('Generate Treeview', () => {
  describe('Treeview', () => {
    let firstState: any
    const templatesIndex: TreeviewIndex[] = [
      {
        _id: 'subpackage.json',
        title: 'Subpackage',
      },
      {
        _id: 'geometries/box/box-blueprint.json',
        title: 'Box Blueprint',
      },
      {
        _id: 'root/simos-blueprint.json',
        title: 'Simos Blueprint Template',
      },
    ]

    beforeEach(() => {
      firstState = generateTreeViewNodes({}, templatesIndex, 'api/templates')
    })

    it('should generate treeview', () => {
      expect(firstState).toMatchObject({
        '/subpackage.json': {
          path: '/subpackage.json',
          type: 'file',
          endpoint: 'api/templates',
        },
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

    it('should add new file', () => {
      const newIndex = [{ _id: 'root/test.json', title: 'Test Blueprint' }]
      const updatedState = generateTreeViewNodes(
        firstState,
        newIndex,
        'api/blueprints'
      )
      expect(updatedState['/root'].children).toEqual([
        '/root/simos-blueprint.json',
        '/root/test.json',
      ])
      expect(updatedState['/root/test.json']).toEqual({
        title: 'Test Blueprint',
        endpoint: 'api/blueprints',
        path: '/root/test.json',
        type: 'file',
      })
      expect(updatedState['/root/simos-blueprint.json']).toBeDefined()
    })
  })

  describe('Treeview with root packages', () => {
    let firstState: any
    const templatesIndex: TreeviewIndex[] = [
      {
        _id: 'wip/wip.json',
        name: 'wip',
      },
    ]

    beforeEach(() => {
      firstState = generateRootPackageNodes(
        {},
        templatesIndex,
        'api/entities_root_packages'
      )
    })

    it('should generate treeview with root package entities', () => {
      expect(firstState).toMatchObject({
        '/wip': {
          path: '/wip',
          type: 'folder',
          isRoot: true,
          children: [],
        },
      })
    })
  })
})
