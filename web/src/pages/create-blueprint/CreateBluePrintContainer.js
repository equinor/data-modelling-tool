import React, { useReducer } from 'react'
import CreateBluePrintLayout from './CreateBluePrintLayout'
import newBluePrintReducer, {
  initialState,
  Actions,
} from './blueprint/CreateBluePrintReducer'
import treeViewExistingReducer from './existing/TreeViewExistingReducer'
import { generateTreeview } from '../../util/generateTreeview'
import templatesIndex from './json/index_templates'
import blueprintsIndex from './json/index_blueprints'

const filesInitialState = Object.assign(
  {},
  generateTreeview(templatesIndex, 'api/templates'),
  generateTreeview(blueprintsIndex, 'api/templates')
)

export default () => {
  const [state, dispatch] = useReducer(newBluePrintReducer, initialState)
  const [filesState, filesDispatch] = useReducer(
    treeViewExistingReducer,
    filesInitialState
  )

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
