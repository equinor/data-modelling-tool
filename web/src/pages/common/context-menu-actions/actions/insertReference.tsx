import Api2, { BASE_CRUD } from '../../../../api/Api2'
import { TreeNodeRenderProps } from '../../../../components/tree-view/TreeNode'
import { DmtApi } from '../../../../api/Api'
import { DocumentAPI } from '../../../../api/Api3'

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
      alert('ERROR: Not Implemented. Inserting references is not implemented')
      setShowModal(false)
      const dataSource = node.nodeData.meta.dataSource
      const nodeIdSplit = node.nodeData.nodeId.split('.')
      let params = {}
      if (nodeIdSplit.length > 1) {
        params = { params: { attribute: nodeIdSplit[1] } }
      }
      // Get current file
      // @ts-ignore
      const currentFileResponse = await DocumentAPI.getById({
        // @ts-ignore
        dataSourceId: dataSource,
        documentId: nodeIdSplit[0],
      })

      // Get referenced file
      // TODO: Support diff dataSources
      // const refDataSource = formData.reference.id.split('/')[0]
      // const refDocId = formData.reference.id.split('/')[1]
      const refDocId = formData.reference.id

      // @ts-ignore
      const referenceFileResponse = await DocumentAPI.getById({
        // @ts-ignore
        dataSourceId: dataSource,
        documentId: refDocId,
      })

      let newData = currentFileResponse.data.document
      const referencedDocument = referenceFileResponse.data.document

      if (Array.isArray(newData)) {
        newData.push(referencedDocument)
      } else {
        newData = referencedDocument
      }

      await DocumentAPI.update({
        // @ts-ignore
        dataSourceId: dataSource,
        documentId: nodeIdSplit[0],
        // @ts-ignore
        attribute: params,
        requestBody: newData,
      }).then(() =>
        createNodes({
          documentId: node.nodeData.nodeId,
          // @ts-ignore
          nodeUrl: `${api.indexGet(dataSource)}/${node.parent}`,
          node,
        })
      )
    },
  }
}
