import React, { useReducer } from 'react'
import CreateBluePrintLayout from './CreateBluePrintLayout'
import treeReducer, {
  initialState,
} from '../../components/tree-view/TreeReducer'

import models from './json/models'

export default () => {
  const [dataExistingModels, dispatchExistingModel] = useReducer(
    treeReducer,
    models
  )
  const [dataNewBlueprint, dispatchNewBlueprint] = useReducer(
    treeReducer,
    initialState
  )
  return (
    <CreateBluePrintLayout
      dataExistingModels={dataExistingModels}
      dispatchExistingModel={dispatchExistingModel}
      dataNewBlueprint={dataNewBlueprint}
      dispatchNewBlueprint={dispatchNewBlueprint}
    />
  )
}
