import React, { useState } from 'react'
//@ts-ignore
import { NotificationManager } from 'react-notifications'
import axios from 'axios'
import { DmtApi } from '../../../api/Api'
import { NodeComponentProps } from '../../common/tree-view/DocumentTree'
import { editPackage } from '../../common/context-menu-actions/EditPackage'
import { ActionConfig } from '../../common/context-menu-actions/Types'
import WithContextMenu from '../../common/context-menu-actions/WithContextMenu'
import { createBlueprint } from '../../common/context-menu-actions/CreateBlueprint'

const api = new DmtApi()

export const RootFolderNode = (props: NodeComponentProps) => {
  const { node, updateNode, addNode, datasource } = props
  const [showModal, setShowModal] = useState(false)
  const configs: ActionConfig[] = [
    /**
     *  Bug in api.
     */
    {
      menuItem: {
        action: 'add-package',
        label: 'Create Package',
      },
      formProps: {
        schemaUrl: api.templatesPackageGet(),
        dataUrl: null,
        onSubmit: (formData: any) => {
          const url = api.packagePost(datasource.id)
          axios
            .post(url, {
              parentId: node.nodeId,
              nodeType: 'folder',
              isRoot: false,
              formData,
            })
            .then(res => {
              console.log(res)
              // const treeNode = new TreeNodeBuilder(res.data)
              //   .setOpen(true)
              //   .buildFolderNode()
              //
              // addNode(treeNode, node.nodeId)
              // setShowModal(false)
              // NotificationManager.success(res.data.id, 'Package created')
            })
            .catch(err => {
              console.log(err)
              NotificationManager.error(
                err.statusText,
                'failed to create package.'
              )
            })
        },
      },
    },
    editPackage({ node, addNode, updateNode, datasource, setShowModal }),
    createBlueprint({ datasource, node, updateNode, addNode, setShowModal }),
  ]
  return (
    <WithContextMenu
      node={node}
      configs={configs}
      showModal={showModal}
      setShowModal={setShowModal}
    />
  )
}
