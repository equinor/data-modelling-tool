import { TreeNodeRenderProps } from '../../../../components/tree-view/TreeNode'
//@ts-ignore
import Api2, { BASE_CRUD } from '../../../../api/Api2'
import { Input, Method, Output } from './actions'
import { DmtApi } from '../../../../api/Api'
//@ts-ignore
import { NotificationManager } from 'react-notifications'
import { ExplorerAPI } from '../../../../api/Api3'

const api = new DmtApi()
export default (
  outputType: string,
  input: Input,
  method: Method,
  node: TreeNodeRenderProps,
  setShowModal: Function,
  createNodes: Function,
  handleUpdate: Function,
  createEntity: Function
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
      const [dataSource, parentId] = formData.destination.split('/', 2)

      async function executeAction() {
        setShowModal(false)

        // Create the result file
        await ExplorerAPI.addToParent({
          // @ts-ignore
          dataSourceId: dataSource,
          inlineObject: {
            attribute: 'content',
            // @ts-ignore
            description: formData.description,
            name: formData.name,
            parentId: parentId,
            type: outputType,
          },
        })
          .then((response: any) => {
            // Create the result node in index tree
            createNodes({
              // @ts-ignore
              documentId: `${response.uid}`,
              nodeUrl: `${api.indexGet(dataSource)}/${parentId}`,
              node,
            })

            const output: Output = {
              blueprint: formData.type,
              entity: {
                // @ts-ignore
                _id: response.uid,
                type: outputType,
                name: formData.name,
              },
              dataSource: dataSource,
              // @ts-ignore
              id: response.uid,
            }

            const handleUpdateWithTreeUpdate = (output: any) => {
              handleUpdate(output, parentId)
            }

            method({
              input,
              output,
              updateDocument: handleUpdateWithTreeUpdate,
              createEntity,
            })
          })
          .catch((error: any) => {
            console.error(error)
            NotificationManager.error(
              `Failed to create new result file: ${error?.response?.message}`
            )
          })
      }

      await executeAction()
    },
  }
}
