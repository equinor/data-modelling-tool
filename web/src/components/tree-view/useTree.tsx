import { useEffect, useReducer } from 'react'
import TreeReducer, { Actions, NodeActions } from './TreeReducer'
import Tree, { TreeNodeData } from './Tree'

export interface IModels {
  tree: any
}

export interface IOperations {
  addNode(node: TreeNodeData, parentId: string): void

  addNodes(nodes: object): void

  setNodes(nodes: object): void

  addChild(parentId: string, childId: string): void

  updateNode(node: TreeNodeData): void

  removeNode(nodeId: string, parentId?: string): void

  replaceNode(
    parentId: string,
    oldId: string,
    newId: string,
    title: string
  ): void

  toggle(nodeId: string): void

  search(term: string): void

  search(term: string): void

  isOpen(nodeId: string): boolean

  isExpandable(nodeId: string): boolean

  hasChild(parentId: string, childId: string): boolean

  getNode(nodeId: string): TreeNodeData

  setIsLoading(nodeId: string, isLoading: boolean): void

  replaceNodes(
    nodeId: string,
    parentId: string,
    treeNodes: TreeNodeData[]
  ): void
}

export interface ITree {
  models: IModels
  operations: IOperations
}

export const useTree = (tree: Tree): ITree => {
  const [state, dispatch] = useReducer(TreeReducer, tree)

  useEffect(() => {
    dispatch(Actions.setNodes(tree))
  }, [tree])

  const search = (term: string) => dispatch(Actions.filterTree(term))

  const toggle = (nodeId: string): void => {
    dispatch(NodeActions.toggleNode(nodeId))
  }

  const addNode = (node: TreeNodeData, parentId: string) => {
    dispatch(NodeActions.createNode({ ...node, isOpen: true }))
    if (parentId) {
      dispatch(NodeActions.addChild(parentId, node.nodeId))
    }
  }

  const addNodes = (nodes: object) => {
    dispatch(Actions.addNodes(nodes))
  }

  const setNodes = (nodes: object) => {
    dispatch(Actions.setNodes(nodes))
  }

  const addChild = (parentId: string, childId: string) => {
    dispatch(NodeActions.addChild(parentId, childId))
  }

  const updateNode = (node: TreeNodeData) => {
    dispatch(NodeActions.updateNode(node.nodeId, node.title))
  }

  const hasChild = (parentId: string, childId: string): any => {
    return state[parentId].children.includes(childId)
  }

  const removeNode = (nodeId: string, parentId?: string) => {
    if (parentId) {
      dispatch(NodeActions.removeChild(parentId, nodeId))
    }
    dispatch(NodeActions.deleteNode(nodeId))
  }

  const isOpen = (nodeId: string) => {
    return state[nodeId].isOpen
  }

  const isExpandable = (nodeId: string) => {
    return state[nodeId].isExpandable
  }

  const getNode = (nodeId: string) => {
    return state[nodeId]
  }

  const setIsLoading = (nodeId: string, isLoading: boolean) => {
    return dispatch(NodeActions.setLoading(nodeId, isLoading))
  }

  const replaceNode = (
    parentId: string,
    oldId: string,
    newId: string,
    title: string
  ) => {
    dispatch(NodeActions.removeChild(parentId, oldId))
    dispatch(NodeActions.replaceNode(oldId, newId))
    dispatch(NodeActions.addChild(parentId, newId))
    dispatch(NodeActions.updateNode(newId, title))
  }

  const replaceNodes = (
    nodeId: string,
    parentId: string,
    treeNodes: TreeNodeData[]
  ) => {
    // Update existing nodes
    dispatch(Actions.replaceNodes(treeNodes))
    // Add new nodes
    dispatch(Actions.addNodes(treeNodes))
    if (parentId) {
      // Adding child relationship to the parent (this may already exist)
      dispatch(NodeActions.addChild(parentId, nodeId))
    }
  }

  return {
    models: {
      tree: state,
    },
    operations: {
      addNode,
      addNodes,
      addChild,
      updateNode,
      removeNode,
      replaceNode,
      hasChild,
      toggle,
      search,
      isOpen,
      isExpandable,
      getNode,
      setIsLoading,
      replaceNodes,
      setNodes,
    },
  }
}
