import { TreeNodeRenderProps } from '../../../../components/tree-view/TreeNode'
//@ts-ignore
import Api2, { BASE_CRUD } from '../../../../api/Api2'
import axios from 'axios'
import { Input, Method, Output } from './actions'

export default (
  outputType: string,
  input: Input,
  method: Method,
  node: TreeNodeRenderProps,
  setShowModal: Function,
  createNodes: Function,
  handleUpdate: Function,
  dataSource: string
) => {
  return {
    // Function to fetch the document used to create the rjsc-form
    fetchDocument: ({ onSuccess, onError = () => {} }: BASE_CRUD): void => {
      Api2.get({
        // TODO: Use a standard CREATE_ENTITY schema
        url:
          '/api/v2/json-schema/system/DMT/actions/NewActionResult?ui_recipe=DEFAULT_CREATE',
        onSuccess: result => onSuccess({ template: result, document: {} }),
        onError,
      })
    },
    onSubmit: async (formData: any) => {
      async function executeAction() {
        setShowModal(false)

        // TODO: Validate formData. Should not be empty
        // TODO: Catch request errors
        // Create the result file
        let response = await axios.post('/api/v2/explorer/entities/add-file', {
          attribute: 'content',
          description: formData.description,
          name: formData.name,
          parentId: formData.destination,
          type: outputType,
        })

        // Create the result node in index tree
        createNodes({
          documentId: `${response.data.uid}`,
          nodeUrl: `/api/v3/index/${dataSource}`,
          node,
        })

        const output: Output = {
          blueprint: formData.type,
          entity: response.data.data,
          dataSource: dataSource,
          id: response.data.uid,
        }

        method({ input, output, updateDocument: handleUpdate })
      }

      await executeAction()
    },
  }
}
