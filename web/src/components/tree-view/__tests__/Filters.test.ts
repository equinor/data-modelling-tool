import { filterNodes } from '../Filters'

const data = {
  '/root': {
    path: '/root',
    type: 'folder',
    isRoot: true,
    children: ['/root/subpackage'],
  },
  '/root/subpackage': {
    path: '/root/subpackage',
    type: 'folder',
    children: ['/root/subpackage/readme.md'],
  },
  '/root/subpackage/readme.md': {
    path: '/root/subpackage/readme.md',
    type: 'file',
    content: 'Thanks for reading me me. But there is nothing here.',
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
    path: '/geometries/box/box-blueprint.json',
    type: 'file',
    content: 'this is a box',
  },
}

it.skip('filters leafnode and all parents', () => {
  const filtered = filterNodes(data, '/root/subpackage/readme.md')
  expect(Object.keys(filtered).length).toEqual(3)
})
