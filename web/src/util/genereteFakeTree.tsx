export default function generateFakeTree() {
  let tree: any = {
    0: {
      nodeId: '0',
      children: [],
      title: '0',
      isRoot: true,
      isHidden: false,
      type: 'folder',
    },
  }

  for (let i = 1; i < 30; i++) {
    const id = `${i}`
    let parentId = Math.floor(Math.pow(Math.random(), 2) * i)
    tree[id] = {
      nodeId: id,
      children: [],
      title: id,
      isRoot: false,
      isHidden: false,
      type: 'folder',
      isOpen: true,
    }
    tree[parentId].children.push(id)
  }

  return tree
}
