import TreeReducer, {
  Actions as CommonTreeActions,
} from '../../../components/tree-view/TreeReducer'
import {
  generateRootPackageNodes,
  generateTreeView,
  generateTreeViewItem,
  generateTreeViewNodes,
} from '../../../util/generateTreeView'

export const TOGGLE_NODE = 'TOGGLE_NODE'
export const FILTER_TREE = 'FILTER_TREE'
const ADD_ROOT_PACKAGE = 'ADD_ROOT_PACKAGE'
const ADD_PACKAGE = 'ADD_PACKAGE'
const ADD_FILE = 'ADD_FILE'

export const FilesActions = {
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
  addAssets: (data, endpoint) => ({
    type: 'ADD_ASSET',
    data,
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
      return generateTreeViewItem(state, action.indexItem, action.endpoint)

    case 'ADD_ASSET':
      if (action.endpoint.indexOf('root_package') > -1) {
        return generateRootPackageNodes(state, action.data, action.endpoint)
      }
      return generateTreeViewNodes(state, action.data, action.endpoint)

    case FILTER_TREE:
    case TOGGLE_NODE:
      return TreeReducer(state, action)

    default:
      console.error('not supported: ', action.type)
  }
}
