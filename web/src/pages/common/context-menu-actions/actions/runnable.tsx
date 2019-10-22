import { TreeNodeRenderProps } from '../../../../components/tree-view/TreeNode'
import Runnable from '../../../../runnable'

export const runnableAction = (
  action: any,
  node: TreeNodeRenderProps,
  createNodes: Function,
  layout: Function
) => {
  return {
    prompt: action.data.prompt,
    onSubmit: (setProgress: Function) => {
      const { data } = action
      const { runnable } = data
      setProgress(0)
      const result = Runnable.run({
        action,
        runnable,
        node,
        setProgress,
        createNodes,
        layout,
      })
      console.log(result)
    },
  }
}
