import { TreeNodeRenderProps } from '../../../../components/tree-view/TreeNode'
import Runnable from '../../../../runnable'

export const runnableAction = (action: any, node: TreeNodeRenderProps) => {
  return {
    prompt: action.data.prompt,
    onSubmit: () => {
      const { data } = action
      const { runnable } = data
      const result = Runnable.run({ action, runnable, node })
      console.log(result)
    },
  }
}
