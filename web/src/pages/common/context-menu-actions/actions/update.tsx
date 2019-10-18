import Api2, { BASE_CRUD } from '../../../../api/Api2'
import values from 'lodash/values'
import { TreeNodeBuilderOld } from '../../tree-view/TreeNodeBuilderOld'
import { processFormData } from './utils/request'

const fetchUpdate = (action: any) => {
  return ({ onSuccess, onError = () => {} }: BASE_CRUD): void =>
    Api2.fetchWithTemplate({
      urlSchema: action.data.schemaUrl,
      urlData: action.data.dataUrl,
      onSuccess,
      onError,
    })
}

export const postUpdate = (
  data: any,
  addNode: Function,
  setShowModal: Function,
  parentId: string
) => {
  const nodes: any = values(data)
  nodes.forEach((item: any, index: number) => {
    delete item['children']
    const node = new TreeNodeBuilderOld(item).build()
    if (index === 0) {
      addNode(node, parentId)
    } else {
      addNode(node, item.parentId)
    }
  })
  setShowModal(false)
}

export const updateAction = (
  action: any,
  addNode: Function,
  setShowModal: Function,
  parentId: string
) => {
  return {
    fetchDocument: fetchUpdate(action),
    onSubmit: (formData: any) => {
      const data = processFormData(action.data.request, formData)
      Api2.put({
        data: data, // { ...formData, ...action.data.request }
        url: action.data.url,
        onSuccess: (result: any) => {
          console.debug('PUT result', result)
          postUpdate(result.data, addNode, setShowModal, parentId)
        },
        onError: (err: any) => console.error(Object.keys(err)),
      })
    },
  }
}
