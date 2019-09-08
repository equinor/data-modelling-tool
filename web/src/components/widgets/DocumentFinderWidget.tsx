import React, { useEffect, useState } from 'react'
import Tree, { TreeNodeData } from '../tree-view/Tree'
import { DmtApi, IndexNode } from '../../api/Api'
import axios from 'axios'
import values from 'lodash/values'
import { RootFolderNode } from '../../pages/blueprints/nodes/RootFolderNode'
import { FolderNode } from '../../pages/blueprints/nodes/FolderNode'
import { BlueprintNode } from '../../pages/blueprints/nodes/BlueprintNode'
import { DocumentActions } from '../../pages/common/DocumentReducer'
import Form from '../Form'
import Modal from '../modal/Modal'

const api = new DmtApi()

interface MyProps {
  onChange: Function
}

interface MyState {
  blueprint: string
}

function getNodeComponent(node: TreeNodeData) {
  switch (node.nodeType) {
    case 'folder':
      if (node.isRoot) {
        return () => <div>{node.title}</div>
      } else {
        return () => <div>{node.title}</div>
      }
    case 'file':
      return () => <div>{node.title}</div>
    default:
      return () => <div>{node.title}</div>
  }
}

class DocumentFinderWidget extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      blueprint: 'Select blueprint...',
      ...props.formData,
      documents: [],
      isLoading: false,
      showModal: false,
    }
  }

  componentDidMount() {
    const datasourceId = 'local-blueprints-equinor'

    const setDocuments = (documents: any) => {
      this.setState({
        documents: documents,
      })
    }

    async function fetchData() {
      axios(api.indexGet(datasourceId))
        .then(res => {
          const nodes = values(res.data)
          const documents = nodes
            .map(node => {
              return {
                ...node,
                nodeId: node.id,
                isOpen: false,
              }
            })
            .reduce((obj, item) => {
              obj[item.nodeId] = item
              return obj
            }, {})
          setDocuments(documents)
        })
        .catch((err: any) => {
          console.error(err)
        })
      //setLoading(false)
    }

    //setLoading(true)
    fetchData()
  }

  render() {
    const { onChange } = this.props
    const { blueprint, documents, showModal } = this.state

    // const [loading, setLoading] = useState(false)
    // const [documents, setDocuments] = useState({})

    //not use useFetch hook because response should be dispatched to the reducer.
    /*useEffect(() => {
            async function fetchData() {
                axios(api.indexGet(datasourceId))
                    .then(res => {
                        const nodes = values(res.data)
                        const documents = nodes
                            .map(node => {
                                return {
                                    ...node,
                                    nodeId: node.id,
                                    isOpen: false,
                                }
                            })
                            .reduce((obj, item) => {
                                obj[item.nodeId] = item
                                return obj
                            }, {})
                        setDocuments(documents)
                    })
                    .catch((err: any) => {
                        console.error(err)
                    })
                //setLoading(false)
            }

            //setLoading(true)
            fetchData()
        }, [datasourceId])
        */

    if (documents.size == 0) {
      return <div>Loading...</div>
    }

    const handleNodeSelect = (node: any) => {
      this.setState(
        {
          blueprint: `${node.nodeId}`,
          showModal: false,
        },
        () => onChange(this.state)
      )
    }

    const setShowModal = (show: any) => {
      this.setState({ showModal: show })
    }
    return (
      <div>
        <input
          style={{ width: '100%' }}
          type="string"
          value={blueprint}
          onClick={setShowModal}
        />
        <Modal toggle={() => setShowModal(!showModal)} open={showModal}>
          <Tree tree={documents} onNodeSelect={handleNodeSelect}>
            {(node: TreeNodeData) => {
              const NodeComponent = getNodeComponent(node)
              /**
               * pass NodeComponent down the render tree, to get access to the indexNode and treeActions. (addNode, updateNode)
               * The Tree only concern about displaying a TreeNode, while NodeComponent enhance a TreeNode's functionality.
               * e.g context menu and modal.
               */
              return <NodeComponent />
            }}
          </Tree>
        </Modal>
      </div>
    )
  }
}

export default DocumentFinderWidget
