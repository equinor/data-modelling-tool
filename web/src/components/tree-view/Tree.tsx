import values from 'lodash/values'
import React, { useEffect, useReducer, useState } from 'react'
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
import { calculateFinalDropPositions, getRootNodes } from './TreeUtils'

export type TreeNodeData = {
  nodeId: string
  nodeType: NodeType
  isOpen: boolean
  title: string
  isRoot: boolean
  isHidden?: boolean
  children?: string[]
}

type TreeProps = {
  children: Function
  tree: object
  onNodeSelect?: (node: TreeNodeData) => void
  isDragEnabled: boolean
}

const Tree = (props: TreeProps) => {
  const { isDragEnabled, tree, children, onNodeSelect } = props

  const [state, dispatch] = useReducer(TreeReducer, tree)
  const [dragState, setDragState] = useState({
    draggableId: '',
    level: -1,
  })

  useEffect(() => {
    dispatch(Actions.setNodes(tree))
  }, [tree])

  const handleSearch = (term: string) => dispatch(Actions.filterTree(term))

  const handleDrag = (result: any) => {
    if (!result.combine && !result.destination) {
      setDragState({
        draggableId: '',
        level: -1,
      })
      return
    }

    // Set the dragged node open again
    const tree = {
      ...state,
      [result.draggableId]: {
        ...state[result.draggableId],
        isOpen: true,
      },
    }

    let { sourcePosition, destinationPosition } = calculateFinalDropPositions(
      tree,
      result,
      dragState.level
    )

    setDragState({
      draggableId: '',
      level: -1,
    })

    if (
      destinationPosition.parentId != -1 &&
      tree[destinationPosition.parentId].nodeType == NodeType.folder
    ) {
      dispatch(
        NodeActions.removeChild(sourcePosition.parentId, sourcePosition.nodeId)
      )
      dispatch(
        NodeActions.addChild(
          destinationPosition.parentId,
          sourcePosition.nodeId,
          destinationPosition.index
        )
      )
    }
  }

  const onDragStart = (result: DragStart) => {
    setDragState({
      draggableId: result.draggableId,
      level: -1,
    })
    dispatch(NodeActions.toggleNode(result.draggableId))
  }

  const handleToggle = (node: TreeNodeData): void => {
    dispatch(NodeActions.toggleNode(node.nodeId))
  }

  const addNode = (node: TreeNodeData, parentId: string) => {
    dispatch(NodeActions.createNode({ ...node, isOpen: true }))
    dispatch(NodeActions.addChild(parentId, node.nodeId))
  }

  const updateNode = (node: TreeNodeData) => {
    dispatch(NodeActions.updateNode(node.nodeId, node.title))
  }

  const onPointerMove = (event: any) => {
    if (dragState.draggableId !== '') {
      const level = Math.floor((event.nativeEvent.offsetX + 20 / 2) / 20) - 1
      setDragState({
        ...dragState,
        level: level, //parseInt(String(parseInt(event.nativeEvent.offsetX) / 20)),
      })
    }
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
        {rootNodes.map((rootNode, rootIndex) => {
          return (
            <DroppableWrapper
              key={rootIndex}
              droppableId={`${rootNode[0].currentItem.nodeId}`}
              onMouseMove={onPointerMove}
            >
              {rootNode.map((item: any, index: number) => {
                const node = item.currentItem
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
