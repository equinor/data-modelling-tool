//@ts-ignore
import { NotificationManager } from 'react-notifications'
import { TreeNodeData } from '../../../components/tree-view/Tree'
import Api2, { BASE_CRUD } from '../../../api/Api2'
import React from 'react'
import { TreeNodeBuilderOld } from '../tree-view/TreeNodeBuilderOld'
import values from 'lodash/values'

export enum ContextMenuActions {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export type ContextMenuActionProps = {
  treeNodeData: TreeNodeData
  addNode: Function
  setShowModal: Function
  removeNode: Function
  updateNode: Function
  replaceNode: Function
  layout?: any
  path: string
  parent: string
}

const fillTemplate = function(templateString: string, templateVars: object) {
  let func = new Function(
    ...Object.keys(templateVars),
    'return `' + templateString + '`;'
  )
  return func(...Object.values(templateVars))
}

const fetchUpdate = (action: any) => {
  return ({ onSuccess, onError = () => {} }: BASE_CRUD): void =>
    Api2.fetchWithTemplate({
      urlSchema: action.data.schemaUrl,
      urlData: action.data.dataUrl,
      onSuccess,
      onError,
    })
}

interface Adict {
  [key: string]: string
}

const processFormData = (requestData: any, formData: any) => {
  const data = {} as any
  Object.keys(requestData).forEach(key => {
    if (typeof requestData[key] === 'object') {
      const adict = {} as Adict
      for (const item_key in requestData[key]) {
        const value: string = requestData[key][item_key]
        if (item_key in formData) {
          const result = fillTemplate(value, formData)
          adict[item_key] = result
        }
      }
      data[key] = adict
    } else {
      data[key] = fillTemplate(requestData[key], formData)
    }
  })
  return data
}

const getFormProperties = (action: any, props: ContextMenuActionProps) => {
  const {
    treeNodeData,
    addNode,
    setShowModal,
    removeNode,
    layout,
    replaceNode,
    path,
    parent,
  } = props

  const showError = (error: any) => {
    console.error(error)
    NotificationManager.error(error.response.data.message, 'Failed')
  }
  // const [dataSourceId, nodeId] = treeNodeData.nodeId.split('/')

  const [method, actionType] = action.type.split('/')

  switch (method) {
    case ContextMenuActions.CREATE: {
      return {
        fetchDocument: ({ onSuccess, onError = () => {} }: BASE_CRUD): void => {
          Api2.get({
            url: action.data.schemaUrl,
            onSuccess: result => onSuccess({ template: result, document: {} }),
            onError,
          })
        },
        onSubmit: (formData: any) => {
          const data = processFormData(action.data.request, formData)
          Api2.post({
            data: data,
            url: action.data.url,
            onSuccess: (result: any) => {
              console.debug('POST result', result)
              const nodes: any = values(result.data)
              nodes.forEach((item: any, index: number) => {
                delete item['children']
                const node = new TreeNodeBuilderOld(item).build()
                if (index == 0) {
                  addNode(node, treeNodeData.nodeId)
                } else {
                  addNode(node, item.parentId)
                }
              })
              setShowModal(false)
            },
            onError: (err: any) => console.error(Object.keys(err)),
          })
        },
      }
    }

    // Option 1: ContextMenuActions.RENAME + change data

    case ContextMenuActions.UPDATE: {
      return {
        fetchDocument: fetchUpdate(action),
        onSubmit: (formData: any) => {
          const data = processFormData(action.data.request, formData)
          Api2.put({
            data: data, // { ...formData, ...action.data.request }
            url: action.data.url,
            onSuccess: (result: any) => {
              console.debug('PUT result', result)
              const nodes: any = values(result.data)
              nodes.forEach((item: any, index: number) => {
                delete item['children']
                const node = new TreeNodeBuilderOld(item).build()
                if (index == 0) {
                  addNode(node, treeNodeData.nodeId)
                } else {
                  addNode(node, item.parentId)
                }
              })
              setShowModal(false)
            },
            onError: (err: any) => console.error(Object.keys(err)),
          })
        },
      }
    }

    case ContextMenuActions.DELETE: {
      return {
        prompt: action.data.prompt,
        onSubmit: () => {
          Api2.post({
            url: action.data.url,
            data: action.data.request,
            onSuccess: () => {
              //removeNode(treeNodeData.nodeId, props.parent)
              //layout.remove(treeNodeData.nodeId)
            },
            onError: (error: any) => showError(error),
          })
        },
      }
    }

    default:
      return {
        schemaUrl: '',
        dataUrl: '',
        onSubmit: () => {},
      }
  }
}

export class ContextMenuActionsFactory {
  getActionConfig(action: any, props: ContextMenuActionProps) {
    return {
      formProps: getFormProperties(action, props),
      action: action.type,
    }
  }
}
