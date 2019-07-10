import React, { useReducer } from 'react'
import CreateBluePrintLayout from './CreateBluePrintLayout'
import newBluePrintReducer, {
  initialState,
  Actions,
} from './blueprint/CreateBluePrintReducer'
import treeViewExistingReducer from './existing/TreeViewExistingReducer'

export default () => {
  const [state, dispatch] = useReducer(newBluePrintReducer, initialState)
  const [filesState, filesDispatch] = useReducer(treeViewExistingReducer, {})

  const addAsset = node => {
    dispatch(Actions.addNodes(node))
    dispatch(Actions.setSelectedTemplatePath(node.path))
  }

  return (
    <CreateBluePrintLayout
      state={state}
      dispatch={dispatch}
      filesState={filesState}
      filesDispatch={filesDispatch}
      addAsset={addAsset}
    />
  )
}
