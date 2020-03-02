import Api2, { BASE_CRUD } from '../../../../api/Api2'
import { RegisteredPlugins } from '../../layout-components/DocumentComponent'

export const importAction = (action: any) => {
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
