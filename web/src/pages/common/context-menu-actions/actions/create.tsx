import Api2, { BASE_CRUD } from '../../../../api/Api2'
import values from 'lodash/values'
import { TreeNodeBuilderOld } from '../../tree-view/TreeNodeBuilderOld'
import { processFormData } from './utils/request'
import { IndexNode } from '../../../../api/Api'
import { toObject } from './utils/to_object'
import { TreeNodeRenderProps } from '../../../../components/tree-view/TreeNode'

interface PostCreateProps {
  response: any
  nodeUrl: string
  node: TreeNodeRenderProps
}

const createNodes = (props: PostCreateProps) => {
  const { response, nodeUrl, node } = props
  Api2.get({
    url: `${nodeUrl}/${response.uid}`,
    onSuccess: result => {
      const nodes: any = values(result)
      const indexNodes = nodes.map((node: IndexNode) =>
        new TreeNodeBuilderOld(node).build()
      )
      node.actions.addNodes(indexNodes.reduce(toObject, {}))
      // Connect new nodes to parent in tree
      node.actions.addChild(node.nodeData.nodeId, nodes[0]['id'])
    },
    onError: (err: any) => console.error(Object.keys(err)),
  })
}

export const createAction = (
  action: any,
  node: TreeNodeRenderProps,
  setShowModal: Function,
  showError: Function
) => {
  const handleSubmit = () => {
    return (formData: any) => {
      const data = processFormData(action.data.request, formData)
      Api2.post({
        data: data,
        url: action.data.url,
        onSuccess: (result: any) => {
          createNodes({
            response: result.data,
            nodeUrl: action.data.nodeUrl,
            node,
          })
          setShowModal(false)
        },
        onError: (error: any) => showError(error),
      })
    }
  }

  return {
    selectedUiSchema: 'DEFAULT_CREATE',
    fetchDocument: ({ onSuccess, onError = () => {} }: BASE_CRUD): void => {
      Api2.get({
        url: action.data.schemaUrl,
        onSuccess: result => onSuccess({ template: result, document: {} }),
        onError,
      })
    },
    onSubmit: handleSubmit,
  }
}
