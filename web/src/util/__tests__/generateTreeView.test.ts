import { generateTreeViewNodes, TreeviewIndex } from '../generateTreeView'

describe('Generate Treeview', () => {
  const blueprints = [
    {
      _id: 'propellers/1.0.0/propeller.json',
      title: 'Propeller',
    },
    {
      _id: 'propellers/1.0.0/package.json',
      title: 'Propeller',
      version: '1.0.0',
    },
    {
      _id: 'propellers/1.0.1/propeller.json',
      title: 'Propeller',
    },
    {
      _id: 'propellers/1.0.1/package.json',
      title: 'Propeller',
      version: '1.0.1',
    },
    {
      _id: 'snorre_ship/2.3.1/package.json',
      title: 'Snorre Ship',
      version: '2.3.1',
    },
    {
      _id: 'snorre_ship/2.3.1/ship.json',
      title: 'Ship',
    },
    {
      _id: 'propellers/package.json',
      title: 'Propeller',
    },
    {
      _id: 'snorre_ship/package.json',
      title: 'Ship',
    },
  ]

  it('should generate treeview', () => {
    const state = generateTreeViewNodes(blueprints)
    expect(state).toMatchObject({
      //packages
      'propellers/package.json': {
        isRoot: true,
        type: 'folder',
        path: 'propellers/package.json',
        title: 'Propeller',
        children: [
          'propellers/1.0.0/package.json',
          'propellers/1.0.1/package.json',
        ],
      },
      'snorre_ship/package.json': {
        isRoot: true,
        type: 'folder',
        path: 'snorre_ship/package.json',
        title: 'Ship',
        children: ['snorre_ship/2.3.1/package.json'],
      },
      //subpackage
      'propellers/1.0.0/package.json': {
        path: 'propellers/1.0.0/package.json',
        type: 'folder',
        isRoot: false,
        title: '1.0.0',
      },
      'propellers/1.0.1/package.json': {
        isRoot: false,
        title: '1.0.1',
      },
      'snorre_ship/2.3.1/package.json': {
        path: 'snorre_ship/2.3.1/package.json',
        type: 'folder',
        isRoot: false,
        title: '2.3.1',
      },

      //files
      'snorre_ship/2.3.1/ship.json': {
        path: 'snorre_ship/2.3.1/ship.json',
        type: 'file',
        isRoot: false,
        title: 'Ship',
      },
      'propellers/1.0.0/propeller.json': {
        path: 'propellers/1.0.0/propeller.json',
        type: 'file',
        isRoot: false,
        title: 'Propeller',
      },
      'propellers/1.0.1/propeller.json': {
        path: 'propellers/1.0.1/propeller.json',
        type: 'file',
        isRoot: false,
        title: 'Propeller',
      },
    })
  })
})
