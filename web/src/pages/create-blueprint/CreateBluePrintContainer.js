import React, { useReducer, useState } from 'react'
import CreateBluePrintLayout from './CreateBluePrintLayout'
import treeReducer, {
  initialState,
} from '../../components/tree-view/TreeReducer'

import models from './json/models'
import ModelsReducer from '../../reducers/ModelsReducer'

export default () => {
  const [dataExistingModels, dispatchExistingModel] = useReducer(
    treeReducer,
    models
  )
  const [dataNewBlueprint, dispatchNewBlueprint] = useReducer(
    treeReducer,
    initialState
  )
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [modelFiles, dispatchModelFiles] = useReducer(ModelsReducer, {})
  return (
    <CreateBluePrintLayout
      dataExistingModels={dataExistingModels}
      dispatchExistingModel={dispatchExistingModel}
      dataNewBlueprint={dataNewBlueprint}
      dispatchNewBlueprint={dispatchNewBlueprint}
      selectedTemplate={selectedTemplate}
      onSelect={setSelectedTemplate}
      modelFiles={modelFiles}
      dispatchModelFiles={dispatchModelFiles}
    />
  )
}
