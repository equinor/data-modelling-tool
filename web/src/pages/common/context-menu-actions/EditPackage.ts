import axios from 'axios'
//@ts-ignore
import { NotificationManager } from 'react-notifications'
import { ActionConfig } from '../../blueprints/nodes/DataSourceNode'
import { ContextMenuActionProps } from './Types'
import { DmtApi } from '../../../api/Api'
const api = new DmtApi()

export function editPackage(props: ContextMenuActionProps): ActionConfig {
  const { node, datasource, updateNode, setShowModal } = props
  return {
    menuItem: {
      action: 'edit-package',
      label: 'Edit Package',
    },
    formProps: {
      schemaUrl: api.templatesPackageGet(),
      dataUrl: api.documentGet(datasource.id, node.nodeId),
      onSubmit: (formData: any) => {
        const url = api.documentPut(datasource.id, node.nodeId)
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
