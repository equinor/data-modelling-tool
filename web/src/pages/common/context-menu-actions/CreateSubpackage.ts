import { DmtApi } from '../../../api/Api'
import Api2 from '../../../api/Api2'
import { getDataSourceIDFromAbsolutID } from '../../../util/helperFunctions'
import { NodeType } from '../../../api/types'
import { postPackage } from './CreatePackage'
import { ContextMenuActionProps } from './ContextMenuActionsFactory'

const api = new DmtApi()

export const createSubpackage = (props: ContextMenuActionProps): any => {
  const { treeNodeData } = props
  return {
    fetchDocument: Api2.fetchCreatePackage,
    onSubmit: (formData: any) => {
      const datasourceId = getDataSourceIDFromAbsolutID(treeNodeData.nodeId)
      const url = api.packagePost(datasourceId)
      const templateRef = 'templates/subpackage-template'

      const data = {
        parentId: treeNodeData.nodeId,
        formData,
        nodeType: NodeType.subPackage,
        meta: {
          name: formData.title,
          templateRef,
        },
      }
      postPackage({ data, url, ...props })
    },
  }
}
