import TreeReducer, {
  Actions as CommonTreeActions,
} from '../../../components/tree-view/TreeReducer'
import {
  generateTreeViewNodes,
  getParentPath,
} from '../../../util/generateTreeView'

export const TOGGLE_NODE = 'TOGGLE_NODE'
export const FILTER_TREE = 'FILTER_TREE'
const ADD_ROOT_PACKAGE = 'ADD_ROOT_PACKAGE'
const ADD_PACKAGE = 'ADD_PACKAGE'
const ADD_FILE = 'ADD_FILE'
const ADD_ASSET = 'ADD_ASSET'

export const FilesActions = {
  ...CommonTreeActions,
  addRootPackage: path => ({
    type: ADD_ROOT_PACKAGE,
    path,
  }),
  addPackage: (path, title) => ({
    type: ADD_PACKAGE,
    node: {
      path,
      type: 'folder',
      isRoot: false,
      title,
      children: [],
    },
  }),
  addFile: path => ({
    type: ADD_FILE,
    node: {
      path,
      type: 'file',
      isRoot: false,
    },
  }),
  addAssets: (data, endpoint) => ({
    type: ADD_ASSET,
    data,
    endpoint,
  }),
}

export default (state, action) => {
  switch (action.type) {
    case ADD_ROOT_PACKAGE:
      const version = action.path.split('/')[1]
      const rootTitle = action.path.split('/')[0]

      //emulate reponse from api.
      const index = [
        {
          _id: `${rootTitle}/package.json`,
          title: rootTitle,
        },
        {
          _id: action.path,
          title: rootTitle,
          version,
        },
      ]
      return generateTreeViewNodes(index, { ...state })

    case ADD_PACKAGE:
      return addChild(state, action.node)

    case ADD_FILE:
      const newNode = !state[`/${action.node.path}`]
      if (newNode) {
        return addChild(state, action.node)
      } else {
        //already added.
        return state
      }

    case ADD_ASSET:
      const nodes = generateTreeViewNodes(action.data)
      return { ...state, ...nodes }

    case FILTER_TREE:
    case TOGGLE_NODE:
      return TreeReducer(state, action)

    default:
      console.error('not supported: ', action.type)
  }
}

function addChild(state, childNode) {
  const newState = { ...state }
  newState[childNode.path] = childNode
  newState[getParentPath(childNode.path)].children.push(childNode.path)
  return { ...state, ...newState }
}
