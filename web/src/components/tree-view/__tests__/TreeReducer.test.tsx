import reducer, { Actions, NodeActions } from '../TreeReducer'
import { NodeType } from '../../../api/types'

describe('tree reducer', () => {
  it('should provide the initial state', () => {
    expect(reducer(undefined, {})).toEqual({})
  })

  it('should handle SET_NODES action', () => {
    const stateBefore = {
      node_0: {
        id: 'node_0',
        children: [],
      },
      node_1: {
        id: 'node_1',
        children: [],
      },
    }

    const stateAfter = {
      node_0: {
        id: 'node_2',
        children: [],
      },
      node_1: {
        id: 'node_3',
        children: [],
      },
    }

    const action = Actions.setNodes(stateAfter)

    expect(reducer(stateBefore, action)).toEqual(stateAfter)
  })

  it('should handle CREATE_NODE action', () => {
    const stateBefore = {}
    const nodeId = 'New treeNodeData'
    const action = NodeActions.createNode({
      nodeId: 'New treeNodeData',
      children: [],
      nodeType: NodeType.subPackage,
      isRoot: false,
      title: 'New treeNodeData',
      isOpen: true,
    })
    const stateAfter = {
      [nodeId]: {
        nodeId: nodeId,
        children: [],
        isRoot: false,
        nodeType: NodeType.subPackage,
        title: nodeId,
        isOpen: true,
      },
    }

    expect(reducer(stateBefore, action)).toEqual(stateAfter)
  })

  it('should handle DELETE_NODE action', () => {
    const stateBefore = {
      node_0: {
        id: 'node_0',
        children: ['node_1'],
      },
      node_1: {
        id: 'node_1',
        children: [],
      },
      node_2: {
        id: 'node_2',
        children: ['node_3', 'node_4'],
      },
      node_3: {
        id: 'node_3',
        children: [],
      },
      node_4: {
        id: 'node_4',
        children: [],
      },
    }
    const action = NodeActions.deleteNode('node_2')
    const stateAfter = {
      node_0: {
        id: 'node_0',
        children: ['node_1'],
      },
      node_1: {
        id: 'node_1',
        children: [],
      },
    }

    expect(reducer(stateBefore, action)).toEqual(stateAfter)
  })

  it('should handle ADD_CHILD action', () => {
    const stateBefore = {
      node_0: {
        id: 'node_0',
        children: [],
      },
      node_1: {
        id: 'node_1',
        children: [],
      },
    }
    const action = NodeActions.addChild('node_0', 'node_1')
    const stateAfter = {
      node_0: {
        id: 'node_0',
        children: ['node_1'],
      },
      node_1: {
        id: 'node_1',
        children: [],
      },
    }

    expect(reducer(stateBefore, action)).toEqual(stateAfter)
  })

  it('should handle REMOVE_CHILD action', () => {
    const stateBefore = {
      node_0: {
        id: 'node_0',
        children: ['node_1'],
      },
      node_1: {
        id: 'node_1',
        children: [],
      },
    }
    const action = NodeActions.removeChild('node_0', 'node_1')
    const stateAfter = {
      node_0: {
        id: 'node_0',
        children: [],
      },
      node_1: {
        id: 'node_1',
        children: [],
      },
    }

    expect(reducer(stateBefore, action)).toEqual(stateAfter)
  })
})
