import Api2, { BASE_CRUD } from '../../../../api/Api2'
import values from 'lodash/values'
import { TreeNodeBuilderOld } from '../../tree-view/TreeNodeBuilderOld'
import { processFormData } from './utils/request'
import { IndexNode } from '../../../../api/Api'
import { toObject } from './utils/to_object'

export const postCreate = (
  data: any,
  nodeUrl: string,
  addNode: Function,
  addNodes: Function,
  addChild: Function,
  setShowModal: Function,
  parentId: string
) => {
  Api2.get({
    url: `${nodeUrl}/${data.uid}`,
    onSuccess: result => {
      console.log('NODE(S)', result)
      const nodes: any = values(result)
      /*nodes.forEach((item: any, index: number) => {
                delete item['children']
                const node = new TreeNodeBuilderOld(item).build()
                if (index === 0) {
                    console.log("CONNECT TO PARENT", parentId)
                    addNode(node, parentId)
                } else {
                    addNode(node, item.parentId)
                }
            })*/
      const indexNodes = nodes.map((node: IndexNode) =>
        new TreeNodeBuilderOld(node).build()
      )
      addNodes(indexNodes.reduce(toObject, {}))
      addChild(parentId, nodes[0]['id'])
    },
    onError: (err: any) => console.error(Object.keys(err)),
  })
}

export const createAction = (
  action: any,
  addNode: Function,
  addNodes: Function,
  addChild: Function,
  setShowModal: Function,
  parentId: string
) => {
  return {
    selectedUiSchema: 'DEFAULT_CREATE',
    fetchDocument: ({ onSuccess, onError = () => {} }: BASE_CRUD): void => {
      Api2.get({
        url: action.data.schemaUrl,
        onSuccess: result => onSuccess({ template: result, document: {} }),
        onError,
      })
    },
    onSubmit: (formData: any) => {
      console.log('POST FORM DATA', formData)
      const data = processFormData(action.data.request, formData)
      Api2.post({
        data: data,
        url: action.data.url,
        onSuccess: (result: any) => {
          console.log('RESULT', result)
          postCreate(
            result.data,
            action.data.nodeUrl,
            addNode,
            addNodes,
            addChild,
            setShowModal,
            parentId
          )
          setShowModal(false)
        },
        onError: (err: any) => console.error(Object.keys(err)),
      })
    },
  }
}
