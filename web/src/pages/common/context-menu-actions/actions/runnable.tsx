import { TreeNodeRenderProps } from '../../../../components/tree-view/TreeNode'
import Runnable from '../../../../runnable'
import axios from 'axios'

const getDocument = async (dataUrl: string, showError: Function) => {
  try {
    const result = await axios.get(dataUrl)
    return result.data
  } catch (error) {
    showError(error)
  }
}

const updateDocument = async (
  dataUrl: string,
  data: any,
  showError: Function
) => {
  try {
    const result = await axios.put(dataUrl, data)
    return result.data
  } catch (error) {
    showError(error)
  }
}

export const runnableAction = (
  action: any,
  node: TreeNodeRenderProps,
  createNodes: Function,
  layout: any,
  showError: Function
) => {
  return {
    prompt: action.data.prompt,
    onSubmit: (setProgress: Function) => {
      const { data } = action
      const { runnable } = data

      setProgress(0)

      const document = getDocument(action.data.dataUrl, showError)

      if (document) {
        Runnable.run({
          document: document,
          config: runnable,
          setProgress,
        })
          .then(result => {
            updateDocument(action.data.dataUrl, result, showError).then(() => {
              setProgress(100)
              layout.refresh(action.data.documentId)
            })
          })
          .catch((error: any) => {
            showError(error)
          })
      }
    },
  }
}
