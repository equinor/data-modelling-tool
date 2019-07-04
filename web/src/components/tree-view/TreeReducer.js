import keyBy from 'lodash/keyBy'
import {
  expandNodesWithMatchingDescendants,
  filterNodes,
  hideNodesWithNoMatchingDescendants,
} from './Filters'

/**
 * Using a flat state.
 * Example:
 * {
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
		}
  }
 *
 */

export const initialState = {}
const ADD_ROOT_PACKAGE = 'ADD_ROOT_PACKAGE'
const ADD_PACKAGE = 'ADD_PACKAGE'
const ADD_FILE = 'ADD_FILE'
const TOGGLE_NODE = 'TOGGLE_NODE'
const FILTER_TREE = 'FILTER_TREE'
const ADD_NODES = 'ADD_NODES'
const UPDATE_FORM_DATA = 'UPDATE_FORM_DATA'

export const Actions = {
  filterTree: filter => ({
    type: FILTER_TREE,
    filter: filter,
  }),
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
  addNodes: (nodes, path) => ({
    type: ADD_NODES,
    nodes,
    path,
  }),
  toggleNode: path => ({
    type: TOGGLE_NODE,
    path,
  }),
  updateFormData: (path, formData) => ({
    type: UPDATE_FORM_DATA,
    path,
    formData,
  }),
}

export default (state, action) => {
  switch (action.type) {
    case FILTER_TREE:
      let filteredNodes = hideNodesWithNoMatchingDescendants(
        state,
        action.filter
      )
      let expandedNodes = expandNodesWithMatchingDescendants(
        state,
        filteredNodes,
        action.filter
      )
      let nodesAsObject = keyBy(expandedNodes, 'path')
      return { ...nodesAsObject }
    case ADD_ROOT_PACKAGE:
      return { ...state, [action.node.path]: action.node }

    case ADD_PACKAGE:
    case ADD_FILE:
      state[action.rootPath].children.push(action.node.path)
      return { ...state, [action.node.path]: action.node }

    case ADD_NODES:
      const filteredNodesClone = filterNodes(action.nodes, action.path)
      return { ...state, ...filteredNodesClone }

    case TOGGLE_NODE:
      const newState = { ...state }
      newState[action.path].isOpen = !newState[action.path].isOpen
      return newState

    case UPDATE_FORM_DATA:
      const currentNode = state[action.path]
      const updatedNode = Object.assign({}, currentNode, {
        formData: action.formData,
      })
      const nState = { ...state, [action.path]: updatedNode }
      return nState
    default:
      return state
  }
}
