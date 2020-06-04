import { TreeNodeRenderProps } from '../../../../components/tree-view/TreeNode'
//@ts-ignore
import Api2, { BASE_CRUD } from '../../../../api/Api2'
import { Input, Method, Output } from './actions'
import { DmtApi } from '../../../../api/Api'
//@ts-ignore
import { NotificationManager } from 'react-notifications'
import { ExplorerAPI } from '../../../../api/GenApi'

const api = new DmtApi()
export default (
  outputType: string,
  input: Input,
  method: Method,
  node: TreeNodeRenderProps,
  setShowModal: Function,
  createNodes: Function,
  handleUpdate: Function,
  createEntity: Function,
  dataSource: string
) => {
  return {
    // Function to fetch the document used to create the rjsc-form
    fetchDocument: ({ onSuccess, onError = () => {} }: BASE_CRUD): void => {
      Api2.get({
        // TODO: Use a standard CREATE_ENTITY schema
        url: api.jsonSchemaGet(
          'apps/DMT/actions/NewActionResult',
          'DEFAULT_CREATE'
        ),
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
        // TODO: GET DATASOURCE
        let response = await ExplorerAPI.addToParent({
          // @ts-ignore
          dataSourceId: node,
          inlineObject: {
            attribute: 'content',
            // @ts-ignore
            description: formData.description,
            name: formData.name,
            parentId: formData.destination,
            type: outputType,
          },
        }).catch((error: any) => {
          console.error(error)
          NotificationManager.error(
            `Failed to create new result file: ${error?.response?.data?.message}`
          )
        })
        if (!response) return

        // Create the result node in index tree
        createNodes({
          // @ts-ignore
          documentId: `${response.data.uid}`,
          nodeUrl: `${api.indexGet(dataSource)}/${formData.destination}`,
          node,
        })

        const output: Output = {
          blueprint: formData.type,
          entity: {
            // @ts-ignore
            _id: response.data.uid,
            type: outputType,
            name: formData.name,
          },
          dataSource: dataSource,
          // @ts-ignore
          id: response.data.uid,
        }

        const handleUpdateWithTreeUpdate = (output: any) => {
          handleUpdate(output, formData.destination)
        }

        method({
          input,
          output,
          updateDocument: handleUpdateWithTreeUpdate,
          createEntity,
        })
      }

      await executeAction()
    },
  }
}
