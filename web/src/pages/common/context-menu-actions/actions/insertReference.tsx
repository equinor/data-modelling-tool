import Api2, { BASE_CRUD } from '../../../../api/Api2'
import { TreeNodeRenderProps } from '../../../../components/tree-view/TreeNode'
import { DmtApi } from '../../../../api/Api'
import axios from 'axios'

const api = new DmtApi()

export const insertReferenceAction = (
  action: any,
  node: TreeNodeRenderProps,
  setShowModal: Function,
  createNodes: Function
) => {
  return {
    fetchDocument: ({ onSuccess, onError = () => {} }: BASE_CRUD): void => {
      Api2.get({
        url: api.jsonSchemaGet(
          'apps/DMT/actions/InsertReference',
          'DEFAULT_CREATE'
        ),
        onSuccess: result => onSuccess({ template: result, document: {} }),
        onError,
      })
    },
    onSubmit: async (formData: any) => {
      setShowModal(false)
      const dataSource = node.nodeData.meta.dataSource
      const nodeIdSplit = node.nodeData.nodeId.split('.')
      let params = {}
      if (nodeIdSplit.length > 1) {
        params = { params: { attribute: nodeIdSplit[1] } }
      }
      // Get current file
      const currentFileResponse = await axios.get(
        api.getFile(dataSource, nodeIdSplit[0]),
        params
      )

      // Get referenced file
      // TODO: Support diff dataSources
      // const refDataSource = formData.reference.id.split('/')[0]
      // const refDocId = formData.reference.id.split('/')[1]
      const refDocId = formData.reference.id
      const referenceFileResponse = await axios.get(
        api.getFile(dataSource, refDocId)
      )

      let newData = currentFileResponse.data.document
      const referencedDocument = referenceFileResponse.data.document

      if (Array.isArray(newData)) {
        newData.push(referencedDocument)
      } else {
        newData = referencedDocument
      }

      const response = await axios.put(
        api.updateFile(dataSource, nodeIdSplit[0]),
        newData,
        params
      )

      createNodes({
        documentId: node.nodeData.nodeId,
        // @ts-ignore
        nodeUrl: `${api.indexGet(dataSource)}/${node.parent}`,
        node,
      })
    },
  }
}
