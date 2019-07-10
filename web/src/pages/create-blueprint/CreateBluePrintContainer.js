import React, { useReducer } from 'react'
import CreateBluePrintLayout from './CreateBluePrintLayout'
import newBluePrintReducer, {
  initialState,
  Actions,
} from './blueprint/CreateBluePrintReducer'

export default () => {
  const [state, dispatch] = useReducer(newBluePrintReducer, initialState)

  const addAsset = node => {
    dispatch(Actions.addNodes(node))
    dispatch(Actions.setSelectedTemplatePath(node.path))
  }

  return (
    <CreateBluePrintLayout
      state={state}
      dispatch={dispatch}
      addAsset={addAsset}
    />
  )
}
