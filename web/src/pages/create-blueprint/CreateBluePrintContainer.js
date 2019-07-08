import React, { useReducer, useState } from 'react'
import CreateBluePrintLayout from './CreateBluePrintLayout'
import treeReducer, {
  initialState,
} from '../../components/tree-view/TreeReducer'

import ModelsReducer from '../../reducers/ModelsReducer'
import templatesJson from './json/templates'

const nodes = appendEndpoint(templatesJson, '/api/templates')

export default () => {
  const [dataExistingModels, dispatchExistingModel] = useReducer(
    treeReducer,
    nodes
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

/**
 * NB! temporary code until api endpoints /blueprints and /templates are implemented.
 * Adds endpoints to each node.
 * Endpoint is given by the filename.
 * Unnecessary and verbose to add endpoint to each node in json.
 * In the future, templates.json and blueprint.json will be fetched from the api,
 * and it will be easy to add the endpoint property.
 *
 * @param nodes
 * @param endpoint
 * @returns {*}
 */
function appendEndpoint(nodes, endpoint) {
  for (let key in templatesJson) {
    nodes[key].endpoint = endpoint
  }
  return nodes
}
