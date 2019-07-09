import TreeReducer, {
  Actions as CommonTreeActions,
} from '../../../components/tree-view/TreeReducer'

export const TOGGLE_NODE = 'TOGGLE_NODE'
export const FILTER_TREE = 'FILTER_TREE'
const ADD_ROOT_PACKAGE = 'ADD_ROOT_PACKAGE'
const ADD_PACKAGE = 'ADD_PACKAGE'
const ADD_FILE = 'ADD_FILE'

export const Actions = {
  ...CommonTreeActions,
  addRootPackage: path => ({
    type: ADD_ROOT_PACKAGE,
    node: {
      path,
      type: 'folder',
      isRoot: true,
      children: [],
    },
  }),
  addPackage: (rootPath, name) => ({
    type: ADD_PACKAGE,
    rootPath,
    node: {
      path: `${rootPath}/${name}`,
      type: 'folder',
      isRoot: false,
      children: [],
    },
  }),
  addFile: (rootPath, name, content) => ({
    type: ADD_FILE,
    rootPath,
    node: {
      path: `${rootPath}/${name}`,
      type: 'file',
      content,
      children: [],
    },
  }),
}

export default (state, action) => {
  switch (action.type) {
    case ADD_ROOT_PACKAGE:
      return { ...state, [action.node.path]: action.node }

    case ADD_PACKAGE:
    case ADD_FILE:
      state[action.rootPath].children.push(action.node.path)
      return { ...state, [action.node.path]: action.node }

    case FILTER_TREE:
    case TOGGLE_NODE:
      return TreeReducer(state, action)

    default:
      console.error('not supported: ', action.type)
  }
}
