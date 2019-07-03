import React, { useReducer } from 'react'
import CreateBluePrintLayout from './CreateBluePrintLayout'
import treeReducer from '../../components/tree-view/TreeReducer'

import existingModels from './ExistingModels'

export default () => {
  const [dataExistingModels, dispatchExistingModel] = useReducer(
    treeReducer,
    existingModels
  )
  const [dataNewBlueprint, dispatchNewBlueprint] = useReducer(treeReducer, {})

  return (
    <CreateBluePrintLayout
      dataExistingModels={dataExistingModels}
      dispatchExistingModel={dispatchExistingModel}
      dataNewBlueprint={dataNewBlueprint}
      dispatchNewBlueprint={dispatchNewBlueprint}
    />
  )
}
