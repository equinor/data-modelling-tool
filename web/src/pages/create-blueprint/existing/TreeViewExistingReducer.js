import TreeReducer, {
  Actions as CommonTreeActions,
} from '../../../components/tree-view/TreeReducer'
import { generateTreeview } from '../../../util/generateTreeview'

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
  addFile: (indexItem, endpoint) => ({
    type: ADD_FILE,
    indexItem,
    endpoint,
  }),
}

export default (state, action) => {
  switch (action.type) {
    case ADD_ROOT_PACKAGE:
      return { ...state, [action.node.path]: action.node }

    case ADD_PACKAGE:
      return state
    case ADD_FILE:
      //fix children recursive.
      const newState = generateTreeview([action.indexItem], action.endpoint)
      return mergeStatesNewFile(state, newState, action.indexItem)

    case FILTER_TREE:
    case TOGGLE_NODE:
      return TreeReducer(state, action)

    default:
      console.error('not supported: ', action.type)
  }
}

function mergeStatesNewFile(oldState, newState, indexItem) {
  const state = { ...newState, ...oldState }
  const parentPath = indexItem.path.substr(0, indexItem.path.lastIndexOf('/'))
  if (!state[parentPath].children.includes(indexItem.path)) {
    state[parentPath].children.push(indexItem.path)
  }
  return state
}
