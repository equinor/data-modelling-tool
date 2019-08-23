import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Tree from '../../../components/tree-view/Tree'
import {
  BlueprintAction,
  BlueprintActions,
  BlueprintState,
} from '../BlueprintReducer'
import BlueprintTreeviewHeader from './BlueprintTreeviewHeader'
import { TreeNodeData } from '../../../components/tree-view/Tree'
import { RootFolderNode } from './nodes/DataSourceNode'
import { FolderNode } from './nodes/FolderNode'
import { BlueprintNode } from './nodes/BlueprintNode'
import { GenerateTreeview } from '../../../util/generateTreeview'
import generateFakeTree from '../../../util/genereteFakeTree'
import { BlueprintApi } from '../../../open-api/src/apis/BlueprintApi'
const blueprintApi = new BlueprintApi()

interface PropTypes {
  dispatch: (action: BlueprintAction) => void
  state: BlueprintState
}

const mockBlueprints: any[] = [
  {
    id: 'propellers/',
    title: 'Propellers',
    children: ['propellers/1.0.0'],
    node_type: 'root',
  },
  {
    id: 'propellers/1.0.0',
    title: '1.0.0',
    children: ['propellers/1.0.0/propeller.json'],
    node_type: 'version',
  },
  {
    id: 'propellers/1.0.0/propeller.json',
    title: 'Blueprint',
    node_type: 'file',
  },
]

export default (props: PropTypes) => {
  const { state, dispatch } = props
  const [documents, setDocuments] = useState({})

  useEffect(() => {
    async function fetchData() {
      const urlBluePrints = '/api/index/blueprints'
      axios(urlBluePrints)
        .then(res => {
          const nodeBuilder = new GenerateTreeview({})
          const rootTitle = state.datasources[state.selectedDatasourceId].name
          const nodes = nodeBuilder
            .addRootNode(rootTitle)
            // .addNodes(mockBlueprints, rootTitle)
            .build()
          setDocuments(nodes)
        })
        .catch((err: any) => {
          console.error(err)
        })
    }
    if (state.selectedDatasourceId > -1) {
      fetchData()
    }
  }, [state.selectedDatasourceId])

  // //fetch blueprints if datasources is not empty.
  // useEffect(() => {
  //   if (state.datasources.length > 0) {
  //     blueprintApi
  //       .getBlueprints()
  //       .then((res: any) => {
  //         console.log(res)
  //         const nodeBuilder = new GenerateTreeview({})
  //         const rootTitle = state.datasources[state.selectedDatasourceId].title
  //         const nodes = nodeBuilder
  //           .addRootNode(rootTitle)
  //           //@todo replace mockBlueprints with res when API is implemented.
  //           .addNodes(mockBlueprints, rootTitle)
  //           .build()
  //         setDocuments(nodes)
  //       })
  //       .catch(e => console.log(e))
  //   }
  // }, [state.selectedDatasourceId])

  return (
    <div>
      <BlueprintTreeviewHeader state={state} dispatch={dispatch} />

      <div>
        <Tree tree={documents}>
          {(node: TreeNodeData, addNode: Function, updateNode: Function) => {
            const NodeComponent = getNodeComponent(node)
            return (
              <NodeComponent
                dispatch={dispatch}
                addNode={addNode}
                updateNode={updateNode}
                node={node}
              ></NodeComponent>
            )
          }}
        </Tree>
      </div>
    </div>
  )
}

function getNodeComponent(node: TreeNodeData) {
  const versionTest = new RegExp(/\d+.\d+.\d+/)
  let isParentOfVersion = false
  node.children &&
    node.children.forEach(childPath => {
      const childPathTitle = childPath.substr(childPath.lastIndexOf('/') + 1)
      if (versionTest.test(childPathTitle)) {
        isParentOfVersion = true
      }
    })
  if (isParentOfVersion) {
    return () => <div>{node.title}</div>
  }

  switch (node.type) {
    case 'folder':
      return node.isRoot ? RootFolderNode : FolderNode
    case 'file':
      return BlueprintNode
    default:
      return () => <div>{node.title}</div>
  }
}
