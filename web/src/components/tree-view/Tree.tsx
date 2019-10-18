import values from 'lodash/values'
import React, { useEffect, useReducer } from 'react'
import TreeNode from './TreeNode'
import TreeReducer, {
  Actions,
  NodeActions,
} from '../../components/tree-view/TreeReducer'
import SearchTree from './SearchTree'
import DragDropContext from '../dnd/DragDropContext'
import DroppableWrapper from '../dnd/DroppableWrapper'
import DraggableWrapper from '../dnd/DraggableWrapper'
// @ts-ignore
import { DragStart } from 'react-beautiful-dnd'
import { NodeType } from '../../api/types'

export enum NodeIconType {
  'file' = 'file',
  'folder' = 'folder',
  'database' = 'database',
  'ref' = 'ref',
  'default' = '',
}

export type TreeNodeData = {
  nodeId: string
  nodeType: NodeType
  isOpen: boolean
  title: string
  isExpandable: boolean
  isRoot: boolean
  icon?: NodeIconType
  isHidden?: boolean
  isFolder: boolean
  templateRef?: string
  children?: string[]
  meta?: object
}

interface Tree {
  [key: string]: TreeNodeData
}

type TreeProps = {
  children: Function
  tree: Tree
  isDragEnabled: boolean
  render?: Function
}

/**
 *
 * @param nodeId the current nodeId.
 * @param tree object with key,value:  [abs_node_path]: treeNodeData
 * @param path, number[]  list of levels down in the three.
 */
export const treeNodes = (
  nodeId: string,
  tree: any,
  path: any = [],
  track: any = []
): [] => {
  const node: any = tree[nodeId]

  const hasChildren = 'children' in node

  if (!hasChildren || !node.isOpen) {
    return []
  }

  return node.children.reduce((flat: [], childId: string, index: number) => {
    const currentPath: number[] = [...path, index]
    const currentItem: TreeNodeData = tree[childId]
    const currentTrack: string[] = [...track, node.title]

    if (!currentItem || !node.isOpen) {
      return []
    }

    if (currentItem.isOpen && 'children' in currentItem) {
      // iterating through all the children on the given level
      const children: [] = treeNodes(
        currentItem.nodeId,
        tree,
        currentPath,
        currentTrack
      )
      // append to the accumulator
      return [
        ...flat,
        {
          currentItem,
          path: currentPath,
          track: currentTrack,
          level: currentPath.length,
          parent: nodeId,
        },
        ...children,
      ]
    } else {
      // append to the accumulator, but skip children
      return [
        ...flat,
        {
          currentItem,
          path: currentPath,
          track: currentTrack,
          level: currentPath.length,
          parent: nodeId,
        },
      ]
    }
  }, [])
}

const getRootNodes = (rootNode: TreeNodeData, state: Tree) => [
  { currentItem: rootNode, level: 0, track: [] },
  ...treeNodes(rootNode.nodeId, state, []),
]

const Tree = (props: TreeProps) => {
  const { isDragEnabled, tree, children } = props

  const [state, dispatch] = useReducer(TreeReducer, tree)

  useEffect(() => {
    dispatch(Actions.setNodes(tree))
  }, [tree])

  const handleSearch = (term: string) => dispatch(Actions.filterTree(term))

  const handleDrag = (result: any) => {
    if (!result.destination) {
      return
    }

    // TODO
  }

  const onDragStart = (result: DragStart) => {
    dispatch(NodeActions.toggleNode(result.draggableId))
  }

  const handleToggle = (node: TreeNodeData): void => {
    dispatch(NodeActions.toggleNode(node.nodeId))
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

  const addChild = (parentId: string, childId: string) => {
    dispatch(NodeActions.addChild(parentId, childId))
  }

  const updateNode = (node: TreeNodeData) => {
    dispatch(NodeActions.updateNode(node.nodeId, node.title))
  }

  const removeNode = (nodeId: string, parentId: string) => {
    dispatch(NodeActions.removeChild(parentId, nodeId))
    dispatch(NodeActions.deleteNode(nodeId))
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

  const rootNodes = values(state)
    .filter((node: TreeNodeData) => node.isRoot)
    .filter((node: TreeNodeData) => !node.isHidden)
    .map(rootNode => {
      return getRootNodes(rootNode, state)
    })

  return (
    <>
      <SearchTree onChange={handleSearch} />
      <DragDropContext onDragEnd={handleDrag} onDragStart={onDragStart}>
        {rootNodes.map((rootNode, index) => {
          return (
            <DroppableWrapper
              key={index}
              droppableId={`${rootNode[0].currentItem.nodeId}`}
            >
              {rootNode.map((item: any, index: number) => {
                const node: TreeNodeData = item.currentItem
                return (
                  <DraggableWrapper
                    key={node.nodeId + '_' + index}
                    draggableId={`${node.nodeId}`}
                    index={index}
                    isDragEnabled={isDragEnabled}
                  >
                    <TreeNode
                      level={item.level}
                      node={node}
                      path={item.track.join('/')}
                      parent={item.parent}
                      NodeRenderer={children}
                      handleToggle={handleToggle}
                      actions={{
                        addNode,
                        addNodes,
                        addChild,
                        updateNode,
                        removeNode,
                        replaceNode,
                      }}
                    />
                  </DraggableWrapper>
                )
              })}
            </DroppableWrapper>
          )
        })}
      </DragDropContext>
    </>
  )
}

Tree.defaultProps = {
  isDragEnabled: false,
}

export default Tree
