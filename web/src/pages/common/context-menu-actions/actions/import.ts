import { TreeNodeRenderProps } from '../../../../components/tree-view/TreeNode'
import Api2, { BASE_CRUD } from '../../../../api/Api2'
import { processFormData } from './utils/request'
import { RegisteredPlugins } from '../../layout-components/DocumentComponent'

export const importAction = (
  action: any,
  setShowModal: Function,
  node?: TreeNodeRenderProps,
  showError?: Function,
  createNodes?: Function
) => {
  return {
    selectedUiSchema: 'IMPORT',
    plugin: RegisteredPlugins.EDIT_PLUGIN,
    fetchDocument: ({ onSuccess, onError = () => {} }: BASE_CRUD): void => {
      Api2.get({
        url: action.data.schemaUrl,
        onSuccess: result => onSuccess({ template: result, document: {} }),
        onError,
      })
    },
    onSubmit: () => {},
  }
}
