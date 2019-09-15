import axios from 'axios'
//@ts-ignore
import { NotificationManager } from 'react-notifications'
import { ActionConfig, ContextMenuActionProps } from './Types'
import { DmtApi } from '../../../api/Api'
const api = new DmtApi()

export function editPackage(props: ContextMenuActionProps): ActionConfig {
  const { node, updateNode, setShowModal } = props
  return {
    menuItem: {
      action: 'edit-package',
      label: 'Edit Package',
    },
    formProps: {
      schemaUrl: api.templatesPackageGet(),
      dataUrl: api.documentGet(node.nodeId),
      onSubmit: (formData: any) => {
        const url = api.documentPut(node.nodeId)
        axios
          .put(url, formData)
          .then(() => {
            updateNode({ ...node, title: formData.title })
            setShowModal(false)
            NotificationManager.success(formData.title, 'Updated package title')
          })
          .catch((e: any) => {
            console.log(e)
          })
      },
    },
  }
}
