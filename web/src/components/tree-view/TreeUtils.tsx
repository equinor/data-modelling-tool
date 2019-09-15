type TreePosition = {
  parentId: any
  index?: any
  nodeId?: any
}

export const between = (min: number, max: number, number: number) =>
  Math.min(max, Math.max(min, number))

export const getDestination = (
  sourceIndex: any,
  destinationIndex: any,
  sourceNode: any,
  nodes: any,
  level?: number
): TreePosition => {
  const movingDown: boolean = destinationIndex > sourceIndex
  const sameIndex: boolean = destinationIndex === sourceIndex

  // Path of the upper item where the item was dropped
  const upperNode: any = movingDown
    ? nodes[destinationIndex]
    : nodes[destinationIndex - 1] && nodes[destinationIndex - 1]

  // Path of the lower item where the item was dropped
  const lowerNode: any =
    movingDown || sameIndex
      ? nodes[destinationIndex + 1] && nodes[destinationIndex + 1]
      : nodes[destinationIndex]

  if (lowerNode && !upperNode) {
    return {
      parentId: lowerNode.currentItem.nodeId,
      index: lowerNode.path[lowerNode.path.length - 1],
    }
  }

  // Stayed in place, might moved horizontally
  if (sameIndex) {
    if (!upperNode || !level) {
      return {
        parentId: -1,
      }
    }
    console.log(sourceNode)
    console.log(upperNode)
    const minLevel = lowerNode ? lowerNode.level : 1
    const maxLevel = Math.max(sourceNode.level, upperNode.level)
    console.log(minLevel)
    console.log(maxLevel)
    const finalLevel = between(minLevel, maxLevel, level)
    console.log(finalLevel)
    const sameLevel: boolean = finalLevel === sourceNode.level
    console.log(sameLevel)
    if (sameLevel) {
      // Didn't change level
      return {
        parentId: -1,
      }
    }
    if (lowerNode.level == finalLevel) {
      return {
        parentId: lowerNode.parentId,
        index: lowerNode.index,
      }
    }
  }

  // Moved to top of a subtree
  if (
    lowerNode &&
    // check that lower node have higher level
    lowerNode.level > upperNode.level &&
    // check if it is first node in subtree
    lowerNode.index === 0
  ) {
    /*
      If a node is moving to top of a list, it will replace the displaced node.

      Example: Node 3 is moving to top and replaces the displaced node 1 at index 0

      index
              -----------        -----------    -----------             -----------
        0     | node 1           |||||||||||    | node 3 (dragged)      | node 3
              -----------        -----------    -----------             -----------
        1     | node 2     --->  | node 1 (displaced)              ->   | node 1
              -----------        -----------                            -----------
        2     | node 3           | node 2                               | node 2
              -----------        -----------                            -----------
     */
    return {
      parentId: lowerNode.parentId,
      index: 0,
    }
  }

  // Moved in middle of a subtree
  if (
    upperNode &&
    lowerNode &&
    // check that has same parent
    upperNode.parentId === lowerNode.parentId
  ) {
    if (movingDown && upperNode.parentId == sourceNode.parentId) {
      /*
            If a node is moving down within the list, it will replace the displaced (upper) node.

            Example: Node 1 is moving down and replaces the displaced node 2 at index 1

            index
                    -----------        -----------                            -----------
              0     | node 1           | node 2 (displaced)                   | node 2
                    -----------        -----------    -----------             -----------
              1     | node 2     --->  |||||||||||    | node 1 (dragged) ->   | node 1
                    -----------        -----------    -----------             -----------
              2     | node 3           | node 3                               | node 3
                    -----------        -----------                            -----------
             */
      return {
        parentId: upperNode.parentId,
        index: upperNode.index,
      }
    } else {
      /*
            If a node is moving up within the list, it will replace the displaced node.

            Example: Node 1 is moving down and replaces the displaced node 2 at index 1

            index
                    -----------        -----------                            -----------
              0     | node 1           | node 1                               | node 1
                    -----------        -----------    -----------             -----------
              1     | node 2     --->  |||||||||||    | node 3 (dragged) ->   | node 3
                    -----------        -----------    -----------             -----------
              2     | node 3           | node 2 (displaced)                   | node 2
                    -----------        -----------                            -----------
             */
      return {
        parentId: lowerNode.parentId,
        index: lowerNode.index,
      }
    }
  }

  // Moved to end of subtree
  if (upperNode) {
    /*
        If a node is moving to the end of a list, it will replace the displaced node.

        Example: Node 1 is moving to the end of list and replaces the displaced node 3 at index 2

        index
                -----------        -----------                           -----------
          0     | node 1           | node 2                              | node 2
                -----------        -----------                           -----------
          1     | node 2     --->  | node 3 (displaced)             ->   | node 3
                -----------        -----------   -----------             -----------
          2     | node 3           |||||||||||   | node 1 (dragged)      | node 1
                -----------        -----------   -----------             -----------
         */
    return {
      parentId: upperNode.parentId,
    }
  }

  return {
    parentId: -1,
  }
}

export const calculateFinalDropPositions = (
  tree: any,
  dragState: any,
  level: number
): {
  destinationPosition: TreePosition
  sourcePosition: TreePosition
} => {
  const { source, destination, combine } = dragState

  // Source

  const sourceRootNode = tree[source.droppableId]

  const sourceNodes: any = [
    {
      currentItem: sourceRootNode,
      level: 0,
      path: [0],
    },
    ...treeNodes(source.droppableId, tree, []),
  ]

  const sourceIndex = source.index
  const sourceNode: any = sourceNodes[sourceIndex]
  const sourcePosition = {
    parentId: sourceNode.parentId,
    nodeId: sourceNode.currentItem.nodeId,
  }

  if (combine) {
    const destinationPosition = {
      parentId: combine.draggableId,
    }
    return {
      sourcePosition,
      destinationPosition,
    }
  }

  // Destination

  const droppableId = destination
    ? destination.droppableId
    : combine.droppableId

  const destinationRootNode = tree[droppableId]

  const destinationNodes: any = [
    {
      currentItem: destinationRootNode,
      level: 0,
      path: [0],
    },
    ...treeNodes(droppableId, tree, []),
  ]

  return {
    sourcePosition,
    destinationPosition: getDestination(
      sourceIndex,
      destination.index,
      sourceNode,
      destinationNodes,
      level
    ),
  }
}

export const treeNodes = (nodeId: string, tree: any, path: any = []): [] => {
  const node = tree[nodeId]

  const hasChildren = 'children' in node

  if (!hasChildren || !node.isOpen) {
    return []
  }

  return node.children.reduce((flat: any, childId: string, index: any) => {
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
          parentId: nodeId,
          index: index,
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
          parentId: nodeId,
        },
      ]
    }
  }, [])
}

export const getRootNodes = (rootNode: any, state: object) => [
  { currentItem: rootNode, level: 0 },
  ...treeNodes(rootNode.nodeId, state, []),
]
