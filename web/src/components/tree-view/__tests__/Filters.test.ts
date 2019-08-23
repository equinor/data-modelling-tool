import { filterNodes } from '../Filters'

const data = {
  '/root': {
    nodeId: '/root',
    type: 'folder',
    isRoot: true,
    children: ['/root/subpackage'],
  },
  '/root/subpackage': {
    nodeId: '/root/subpackage',
    type: 'folder',
    children: ['/root/subpackage/readme.md'],
  },
  '/root/subpackage/readme.md': {
    nodeId: '/root/subpackage/readme.md',
    type: 'file',
    content: 'Thanks for reading me me. But there is nothing here.',
  },
  '/geometries': {
    nodeId: '/geometries',
    type: 'folder',
    isRoot: true,
    children: ['/geometries/box'],
  },
  '/geometries/box': {
    nodeId: '/geometries/box',
    type: 'folder',
    children: ['/geometries/box/box-blueprint.json'],
  },
  '/geometries/box/box-blueprint.json': {
    nodeId: '/geometries/box/box-blueprint.json',
    type: 'file',
    content: 'this is a box',
  },
}

it('filters nodes', () => {
  const filtered = filterNodes(data, '/root/subpackage/readme.md')
  expect(Object.keys(filtered).length).toEqual(3)
})
