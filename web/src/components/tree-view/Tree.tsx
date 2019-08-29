import values from 'lodash/values'
import React, { useEffect, useReducer } from 'react'
import TreeNode from './TreeNode'
import TreeReducer, {
  Actions,
  NodeActions,
  NodeType,
} from '../../components/tree-view/TreeReducer'
import SearchTree from './SearchTree'
import DragDropContext from '../dnd/DragDropContext'
import DroppableWrapper from '../dnd/DroppableWrapper'
import DraggableWrapper from '../dnd/DraggableWrapper'
// @ts-ignore
import { DragStart } from 'react-beautiful-dnd'

export type TreeNodeData = {
  nodeId: string
  type: NodeType
  isOpen: boolean
  title: string
  isRoot: boolean
  isHidden?: boolean
  children?: string[]
}

type TreeProps = {
  children: Function
  tree: object
  onNodeSelect?: (node: TreeNodeData) => TreeNodeData
  isDragEnabled: boolean
}

export const treeNodes = (nodeId: string, tree: any, path: any = []): [] => {
  // TODO: Can we skip children checks?
  return tree[nodeId]
    ? 'children' in tree[nodeId] &&
        tree[nodeId].children.reduce(
          (flat: any, childId: string, index: any) => {
            const currentPath = [...path, index]
            const currentItem = tree[childId]
            if (currentItem.isOpen && 'children' in currentItem) {
              // iterating through all the children on the given level
              const children = treeNodes(currentItem.nodeId, tree, currentPath)
              // append to the accumulator
              return [
                ...flat,
                {
                  currentItem,
                  path: currentPath,
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
                  level: currentPath.length,
                  parent: nodeId,
                },
              ]
            }
          },
          []
        )
    : []
}

const getRootNodes = (rootNode: any, state: object) => [
  { currentItem: rootNode, level: 0 },
  ...treeNodes(rootNode.nodeId, state, []),
]

const Tree = (props: TreeProps) => {
  const { isDragEnabled, tree, children, onNodeSelect } = props

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
    console.log(result)
    dispatch(NodeActions.toggleNode(result.draggableId))
  }

  const handleToggle = (node: TreeNodeData): void => {
    dispatch(NodeActions.toggleNode(node.nodeId))
  }

  const addNode = (node: TreeNodeData, nodeId: string, nodeType: NodeType) => {
    dispatch(NodeActions.createNode(nodeId, nodeType))
    dispatch(NodeActions.addChild(node.nodeId, nodeId))
  }

  const updateNode = (node: TreeNodeData, title: string) => {
    dispatch(NodeActions.updateNode(node.nodeId, title))
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
                const node = item.currentItem
                return (
                  <DraggableWrapper
                    key={node.nodeId}
                    draggableId={`${node.nodeId}`}
                    index={index}
                    isDragEnabled={isDragEnabled}
                  >
                    <TreeNode
                      level={item.level}
                      node={node}
                      NodeRenderer={children}
                      onNodeSelect={onNodeSelect}
                      handleToggle={handleToggle}
                      addNode={addNode}
                      updateNode={updateNode}
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
