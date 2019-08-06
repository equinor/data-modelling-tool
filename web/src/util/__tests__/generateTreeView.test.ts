import { generateTreeViewNodes, TreeviewIndex } from '../generateTreeView'

describe('Generate Treeview', () => {
  describe('Treeview', () => {
    it('should generate root node treeview', () => {
      const state = generateTreeViewNodes([
        {
          _id: 'root',
          title: 'Root',
        },
      ])
      expect(state).toEqual({
        '/root': {
          path: '/root',
          type: 'folder',
          title: 'Root',
          isRoot: true,
          children: [],
        },
      })
    })

    it('should generate root with file node treeview', () => {
      const state = generateTreeViewNodes([
        {
          _id: 'root',
          title: 'Root',
        },
        {
          _id: 'root/box.json',
          title: 'Box',
        },
      ])
      expect(state).toEqual({
        '/root': {
          path: '/root',
          type: 'folder',
          title: 'Root',
          isRoot: true,
          children: ['/root/box.json'],
        },
        '/root/box.json': {
          isRoot: false,
          path: '/root/box.json',
          type: 'file',
          title: 'Box',
        },
      })
    })

    it('should generate package with file node treeview', () => {
      const state = generateTreeViewNodes([
        {
          _id: 'geometries',
          name: 'Geometries',
        },
        {
          _id: 'geometries/box',
          name: 'Box',
        },
        {
          _id: 'geometries/box/box-blueprint.json',
          title: 'Box Blueprint',
        },
      ])
      expect(state).toEqual({
        '/geometries': {
          path: '/geometries',
          type: 'folder',
          isRoot: true,
          title: 'Geometries',
          children: ['/geometries/box'],
        },
        '/geometries/box': {
          isRoot: false,
          path: '/geometries/box',
          type: 'folder',
          title: 'Box',
          children: ['/geometries/box/box-blueprint.json'],
        },
        '/geometries/box/box-blueprint.json': {
          isRoot: false,
          title: 'Box Blueprint',
          path: '/geometries/box/box-blueprint.json',
          type: 'file',
        },
      })
    })
  })
})
