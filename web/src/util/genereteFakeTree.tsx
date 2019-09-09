function randomString(string_length: any) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ'
  var randomstring = ''
  for (var i = 0; i < string_length; i++) {
    var rnum = Math.floor(Math.random() * chars.length)
    randomstring += chars.substring(rnum, rnum + 1)
  }
  return randomstring
}

export default function generateFakeTree() {
  let tree: any = {
    0: {
      nodeId: '0',
      children: [],
      title: '0',
      isRoot: true,
      isHidden: false,
      nodeType: 'folder',
      isOpen: true,
    },
  }

  for (let i = 1; i < 10; i++) {
    let title = randomString(Math.floor(Math.random() * 10 + 1))
    const id = `${i}`
    let parentId = Math.floor(Math.pow(Math.random(), 2) * i)
    tree[id] = {
      nodeId: id,
      children: [],
      title: `${id}-${title}`,
      isRoot: false,
      isHidden: false,
      nodeType: 'folder',
      isOpen: true,
    }
    tree[parentId].children.push(id)
  }

  return tree
}
