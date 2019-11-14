import { TreeNodeRenderProps } from '../../../../components/tree-view/TreeNode'
import Runnable from '../../../../runnable'
//@ts-ignore
import { NotificationManager } from 'react-notifications'
import Api2 from '../../../../api/Api2'
import { AxiosResponse } from 'axios'

export type RunnableProps = {
  document: any
  config: any
  setProgress: Function
}

export type RunnableMethod = (props: RunnableProps) => any

type RunnableInputProps = {
  document: any
  config: any
  setProgress: Function
  updateDocument: Function
}

export const runnableAction = (
  action: any,
  node: TreeNodeRenderProps,
  createNodes: Function,
  layout: any,
  showError?: Function
) => {
  return {
    prompt: action.data.prompt,
    onSubmit: (setProgress: Function) => {
      const { data } = action
      const { runnable } = data

      setProgress(0)

      function onSuccess(data: any) {
        const { document } = data

        const runMethod: string = runnable['method']

        const hasMethod = runMethod in Runnable

        if (!hasMethod) {
          NotificationManager.error(`Runnable Method ${runMethod}`, 'Not Found')
        } else {
          // @ts-ignore
          const method: RunnableMethod = Runnable[runMethod]

          const inputToRunnable: RunnableInputProps = {
            document,
            config: runnable,
            setProgress,
            updateDocument: (result: any) => {
              update(action, result, setProgress, layout)
            },
          }

          method(inputToRunnable)
        }
      }

      Api2.fetchDocument({
        dataUrl: action.data.dataUrl,
        onSuccess,
        onError: (error: Response) => {
          console.log(error)
          NotificationManager.error(
            'failed to update document: ' + error.statusText
          )
        },
      })
    },
  }
}

function update(action: any, result: any, setProgress: Function, layout: any) {
  Api2.put({
    url: action.data.dataUrl,
    data: result,
    onSuccess: (response: any) => {
      console.log(response)
      NotificationManager.success('updated document: ' + action.data.documentId)
      setProgress(100)
      layout.refresh(action.data.documentId)
    },
    onError: (error: any) => {
      NotificationManager.error(
        'failed to update document: ' + action.data.documentId
      )
    },
  })
}
