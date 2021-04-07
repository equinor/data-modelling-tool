import { IIndex, useIndex } from '../context/index/IndexProvider'
import { TreeNodeData } from '../components/tree-view/Tree'
import {
  IDashboard,
  useDashboard,
} from '../context/dashboard/DashboardProvider'
import { BlueprintEnum } from '../utils/variables'
import { useModalContext } from '../context/modal/ModalContext'
// @ts-ignore
import { NotificationManager } from 'react-notifications'

const validate = (data: any) => {
  if (data.name === undefined || data.name === '') {
    NotificationManager.error('Name is required')
    return false
  }
  if (data.type === BlueprintEnum.ENTITY && data.type === undefined) {
    NotificationManager.error('Type is required')
    return false
  }
  return true
}

interface ToggleProps {
  nodeId: string
}

interface OpenProps {
  nodeId: string
  fetchUrl: any
}

interface CreateProps {
  data: any
  dataUrl: string
  nodeUrl: string
}

interface AddToParentProps {
  dataSourceId: string
  data: any
  nodeUrl: string
}

interface RemoveProps {
  nodeId: string
  parent: string
  url: string
  data: any
}

interface UpdateProps {
  data: any
  nodeUrl: string
  updateUrl: string
}

interface UpdateByIdProps {
  dataSourceId: string
  documentId: string
  attribute: string
  data: any
  nodeUrl: string
}

export interface IUseExplorer {
  toggle({ nodeId }: ToggleProps): void

  open({ nodeId, fetchUrl }: OpenProps): void

  create({ data, dataUrl, nodeUrl }: CreateProps): void

  remove({ nodeId, parent, url, data }: RemoveProps): void

  update({ data, updateUrl, nodeUrl }: UpdateProps): void

  updateById({
    dataSourceId,
    documentId,
    attribute,
    data,
    nodeUrl,
  }: UpdateByIdProps): Promise<any>

  addToParent({ dataSourceId, data, nodeUrl }: AddToParentProps): Promise<any>

  index: IIndex

  dashboard: IDashboard
}

export default function useExplorer(): IUseExplorer {
  const dashboard: IDashboard = useDashboard()
  const index: IIndex = useIndex()
  const { closeModal } = useModalContext()

  const toggle = ({ nodeId }: ToggleProps) => {
    const node: TreeNodeData = index.models.tree.operations.getNode(nodeId)
    if (!node) {
      const message = `Document not found: ${nodeId}`
      NotificationManager.error(message)
      throw message
    }
    index.models.tree.operations.toggle(nodeId)
    if (node.meta.indexUrl && node.isExpandable && !node.isOpen) {
      return index.operations.add(nodeId, node.meta.indexUrl)
    }
  }

  const open = ({ nodeId, fetchUrl }: OpenProps) => {
    if (fetchUrl) {
      dashboard.models.layout.operations.add(
        fetchUrl.uid,
        fetchUrl.title,
        fetchUrl.component,
        fetchUrl.data
      )
      dashboard.models.layout.operations.focus(nodeId)
    }
  }

  const create = async ({ data, dataUrl, nodeUrl }: CreateProps) => {
    if (validate(data)) {
      index.operations.create(data, dataUrl, nodeUrl).then((result: any) => {
        closeModal()
        index.operations.add(result.uid, nodeUrl, true)
      })
    }
  }

  const addToParent = async ({
    dataSourceId,
    data,
    nodeUrl,
  }: AddToParentProps) => {
    if (validate(data)) {
      return index.operations
        .addToParent(dataSourceId, data)
        .then((result: any) => {
          closeModal()
          index.operations.add(result.uid, nodeUrl, true)
          return result
        })
    }
  }

  const remove = async ({ nodeId, parent, url, data }: RemoveProps) => {
    return (
      index.operations
        .remove(nodeId, parent, url, data)
        // @ts-ignore
        .then(dashboard.models.layout.operations.remove(nodeId))
        // .then(index.models.tree.operations.removeNode(nodeId, parent))
        .then(closeModal())
    )
  }

  const update = async ({ data, updateUrl, nodeUrl }: UpdateProps) => {
    index.operations.update(data, updateUrl).then((result: any) => {
      closeModal()
      index.operations
        .add(result.uid, nodeUrl)
        .then(() =>
          dashboard.models.layout.operations.refreshByFilter(result.uid)
        )
    })
  }

  const updateById = async ({
    dataSourceId,
    documentId,
    attribute,
    data,
    nodeUrl,
  }: UpdateByIdProps) => {
    return index.operations
      .updateById(dataSourceId, documentId, attribute, data)
      .then(result => {
        closeModal()
        index.operations
          .add(documentId, nodeUrl)
          .then(() =>
            dashboard.models.layout.operations.refreshByFilter(documentId)
          )
        return result
      })
  }

  return {
    toggle,
    open,
    create,
    remove,
    update,
    updateById,
    addToParent,
    index,
    dashboard,
  }
}
