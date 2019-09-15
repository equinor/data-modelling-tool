import React, { useState } from 'react'
import axios from 'axios'
import { DmtApi } from '../../../api/Api'
import { NodeComponentProps } from '../../common/tree-view/DocumentTree'
import { TreeNodeData } from '../../../components/tree-view/Tree'
import { editPackage } from '../../common/context-menu-actions/EditPackage'
import { TreeNodeBuilder } from '../../common/tree-view/TreeNodeBuilder'
import WithContextMenu from '../../common/context-menu-actions/WithContextMenu'
import { ActionConfig } from '../../common/context-menu-actions/Types'
import { createBlueprint } from '../../common/context-menu-actions/CreateBlueprint'

const api = new DmtApi()

export const FolderNode = (props: NodeComponentProps) => {
  const { node, datasource, updateNode, addNode } = props
  const [showModal, setShowModal] = useState(false)
  const configs: ActionConfig[] = [
    createBlueprint({ datasource, node, updateNode, addNode, setShowModal }),
    {
      menuItem: {
        action: 'add-subpackage',
        label: 'Create SubPackage',
      },
      formProps: {
        schemaUrl: api.templatesPackageGet(),
        dataUrl: null,
        onSubmit: (formData: any) => {
          const url = api.packagePost(node.nodeId)
          axios
            .post(url, {
              parentId: node.nodeId,
              nodeType: 'folder',
              isRoot: false,
              formData,
            })
            .then(res => {
              const treeNode: TreeNodeData = new TreeNodeBuilder(
                res.data
              ).buildFolderNode()
              addNode(treeNode, node.nodeId)
              setShowModal(false)
            })
            .catch(err => {
              console.log(err)
            })
        },
      },
    },
    editPackage({ node, updateNode, addNode, datasource, setShowModal }),
  ]

  return (
    <WithContextMenu
      setShowModal={setShowModal}
      showModal={showModal}
      node={node}
      configs={configs}
    />
  )
}
