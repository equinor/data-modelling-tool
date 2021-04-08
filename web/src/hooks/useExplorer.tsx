import { TreeNodeData } from '../components/tree-view/Tree'
import {
  IDashboard,
  useDashboard,
} from '../context/dashboard/DashboardProvider'
import { BlueprintEnum } from '../utils/variables'
import { useModalContext } from '../context/modal/ModalContext'
// @ts-ignore
import { NotificationManager } from 'react-notifications'
import { IDocumentAPI } from '../services/api/interfaces/DocumentAPI'
import DocumentAPI from '../services/api/DocumentAPI'
import {
  IGlobalIndex,
  useGlobalIndex,
} from '../context/global-index/IndexProvider'

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

  index: IGlobalIndex

  dashboard: IDashboard
}

interface ExplorerProps {
  documentAPI?: IDocumentAPI
}

export default function useExplorer(props: ExplorerProps): IUseExplorer {
  const { documentAPI = new DocumentAPI() } = props
  const dashboard: IDashboard = useDashboard()
  const index: IGlobalIndex = useGlobalIndex()
  const { closeModal } = useModalContext()

  const toggle = ({ nodeId }: ToggleProps) => {
    return index.models.index.operations.toggle(nodeId)
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
      documentAPI.create(dataUrl, data).then((result: any) => {
        closeModal()
        index.models.index.operations.add(result.uid, nodeUrl, true)
      })
    }
  }

  const addToParent = async ({
    dataSourceId,
    data,
    nodeUrl,
  }: AddToParentProps) => {
    if (validate(data)) {
      return documentAPI.addToParent(dataSourceId, data).then((result: any) => {
        closeModal()
        index.models.index.operations.add(result.uid, nodeUrl, true)
        return result
      })
    }
  }

  const remove = async ({ nodeId, parent, url, data }: RemoveProps) => {
    return documentAPI.remove(url, data).then(() => {
      index.models.index.operations
        .remove(nodeId, parent)
        // @ts-ignore
        .then(dashboard.models.layout.operations.remove(nodeId))
        .then(closeModal())
      return true
    })
  }

  const update = async ({ data, updateUrl, nodeUrl }: UpdateProps) => {
    return documentAPI.update(data, updateUrl).then((result: any) => {
      closeModal()
      index.models.index.operations
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
    return documentAPI
      .updateById(dataSourceId, documentId, attribute, data)
      .then(result => {
        closeModal()
        index.models.index.operations
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
