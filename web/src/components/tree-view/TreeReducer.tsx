import keyBy from 'lodash/keyBy'
import {
  expandNodesWithMatchingDescendants,
  hideNodesWithNoMatchingDescendants,
} from './Filters'

/**
 * Using a flat stateTreeview.
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

export const TOGGLE_NODE = 'TOGGLE_NODE'
export const FILTER_TREE = 'FILTER_TREE'

export interface TreeActions {
  filterTree: (filter: string) => any
  toggleNode: (path: string) => any
}

export const Actions: TreeActions = {
  filterTree: (filter: string): object => ({
    type: FILTER_TREE,
    filter: filter,
  }),
  toggleNode: (path: string): object => ({
    type: TOGGLE_NODE,
    path,
  }),
}

export default (state: any, action: any) => {
  switch (action.type) {
    case FILTER_TREE:
      const filter = action.filter.trim()
      let filteredNodes = hideNodesWithNoMatchingDescendants(state, filter)
      let expandedNodes = expandNodesWithMatchingDescendants(
        state,
        filteredNodes,
        filter
      )
      let nodesAsObject = keyBy(expandedNodes, 'path')
      return { ...nodesAsObject }

    case TOGGLE_NODE:
      const newState = { ...state }
      newState[action.path].isOpen = !newState[action.path].isOpen
      return newState

    default:
      return state
  }
}
