import keyBy from 'lodash/keyBy'
import {
  expandNodesWithMatchingDescendants,
  hideNodesWithNoMatchingDescendants,
} from './Filters'

export const TOGGLE_NODE = 'TOGGLE_NODE'
export const FILTER_TREE = 'FILTER_TREE'
export const CREATE_NODE = 'CREATE_NODE'
export const UPDATE_NODE = 'UPDATE_NODE'
export const DELETE_NODE = 'DELETE_NODE'
export const ADD_CHILD = 'ADD_CHILD'
export const REMOVE_CHILD = 'REMOVE_CHILD'
export const SET_NODES = 'SET_NODES'

export enum NodeType {
  folder = 'folder',
  file = 'file',
}

const childIds = (state: any, action: any) => {
  switch (action.type) {
    case ADD_CHILD:
      return [...state, action.childId]
    case REMOVE_CHILD:
      return state.filter((id: any) => id !== action.childId)
    default:
      return state
  }
}

export const NodeActions = {
  createNode: (nodeId: string, nodeType: NodeType) => ({
    type: CREATE_NODE,
    nodeId: nodeId,
    nodeType: nodeType,
  }),
  deleteNode: (nodeId: string) => ({
    type: DELETE_NODE,
    nodeId,
  }),
  addChild: (nodeId: string, childId: string) => ({
    type: ADD_CHILD,
    nodeId,
    childId,
  }),
  removeChild: (nodeId: string, childId: string) => ({
    type: REMOVE_CHILD,
    nodeId,
    childId,
  }),
  toggleNode: (nodeId: string): object => ({
    type: TOGGLE_NODE,
    nodeId,
  }),
  updateNode: (nodeId: string, title: string) => ({
    title,
  }),
}

const node = (state: any, action: any) => {
  switch (action.type) {
    case CREATE_NODE:
      return {
        nodeId: action.nodeId,
        children: [],
        title: action.nodeId,
        type: action.nodeType,
      }
    case ADD_CHILD:
    case REMOVE_CHILD:
      return {
        ...state,
        children: childIds(state.children, action),
      }
    case TOGGLE_NODE:
      return {
        ...state,
        isOpen: !state.isOpen,
      }
    case UPDATE_NODE:
      return {
        ...state,
        title: action.title,
      }
    default:
      return state
  }
}

export interface TreeActions {
  filterTree: (filter: string) => any
  setNodes: (nodes: object) => void
}

export const Actions: TreeActions = {
  filterTree: (filter: string): object => ({
    type: FILTER_TREE,
    filter: filter,
  }),
  setNodes: (nodes: object) => ({
    type: SET_NODES,
    nodes: nodes,
  }),
}

const getAllDescendantIds = (state: any, nodeId: string) =>
  state[nodeId].children.reduce(
    (acc: any, childId: string) => [
      ...acc,
      childId,
      ...getAllDescendantIds(state, childId),
    ],
    []
  )

const deleteMany = (state: any, ids: any) => {
  state = { ...state }
  ids.forEach((id: string) => delete state[id])
  return state
}

export default (state: any = {}, action: any) => {
  console.log(action)
  switch (action.type) {
    case FILTER_TREE:
      const filter = action.filter.trim()
      let filteredNodes = hideNodesWithNoMatchingDescendants(state, filter)
      let expandedNodes = expandNodesWithMatchingDescendants(
        state,
        filteredNodes,
        filter
      )
      let nodesAsObject = keyBy(expandedNodes, 'nodeId')
      return { ...nodesAsObject }

    case SET_NODES:
      return action.nodes

    default:
      const { nodeId } = action
      if (typeof nodeId === 'undefined') {
        return state
      }

      if (action.type === DELETE_NODE) {
        const descendantIds = getAllDescendantIds(state, nodeId)
        return deleteMany(state, [nodeId, ...descendantIds])
      }

      return {
        ...state,
        [nodeId]: node(state[nodeId], action),
      }
  }
}
