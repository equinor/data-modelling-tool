import { filterNodes } from '../Filters'
import { NodeType } from '../../../util/variables'

const data = {
  '/root': {
    _id: '/root',
    nodeType: NodeType.subPackage,
    isRoot: true,
    children: ['/root/subpackage'],
  },
  '/root/subpackage': {
    _id: '/root/subpackage',
    nodeType: 'folder',
    children: ['/root/subpackage/readme.md'],
  },
  '/root/subpackage/readme.md': {
    _id: '/root/subpackage/readme.md',
    nodeType: 'file',
    content: 'Thanks for reading me me. But there is nothing here.',
  },
  '/geometries': {
    _id: '/geometries',
    nodeType: 'package',
    isRoot: true,
    children: ['/geometries/box'],
  },
  '/geometries/box': {
    _id: '/geometries/box',
    nodeType: 'package',
    children: ['/geometries/box/box-blueprint.json'],
  },
  '/geometries/box/box-blueprint.json': {
    _id: '/geometries/box/box-blueprint.json',
    nodeType: 'file',
    content: 'this is a box',
  },
}

it('filters nodes', () => {
  const filtered = filterNodes(data, '/root/subpackage/readme.md')
  //@todo fix
  // expect(Object.keys(filtered).length).toEqual(3)
})
