import {
  IDashboard,
  useDashboard,
} from '../context/dashboard/DashboardProvider'
import { useModalContext } from '../context/modal/ModalContext'
// @ts-ignore
import { NotificationManager } from 'react-notifications'
import { BlueprintEnum, DocumentAPI, IDocumentAPI } from '@dmt/common'

import {
  IGlobalIndex,
  useGlobalIndex,
} from '../context/global-index/IndexProvider'
import { useEffect, useState } from 'react'
import { LayoutComponents } from '../context/dashboard/useLayout'

interface FetchUrl {
  uid: string
  data: object
  title: string
  component: LayoutComponents
}

interface GetProps {
  dataSourceId: string
  documentId: string
  attribute?: string
}

interface GetByPathProps {
  dataSourceId: string
  path: string
}

interface ToggleProps {
  nodeId: string
}

interface OpenProps {
  dataSourceId: string
  nodeId: string
  fetchUrl: FetchUrl
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
  get({ dataSourceId, documentId, attribute }: GetProps): void

  getBlueprint(typeRef: string): void

  getByPath({ dataSourceId, path }: GetByPathProps): void

  toggle({ nodeId }: ToggleProps): void

  open({ nodeId, dataSourceId, fetchUrl }: OpenProps): void

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

  errorMessage: String | null
}

interface ExplorerProps {
  documentAPI?: IDocumentAPI
}

export default function useExplorer(props: ExplorerProps): IUseExplorer {
  const { documentAPI = new DocumentAPI() } = props
  const [blueprintCache, setBlueprintCache] = useState<any>({})
  const dashboard: IDashboard = useDashboard()
  const index: IGlobalIndex = useGlobalIndex()
  const { closeModal } = useModalContext()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  useEffect(() => {
    if (errorMessage) {
      NotificationManager.error(errorMessage)
    }
  }, [errorMessage])

  const validate = (data: any) => {
    if (data.name === undefined || data.name === '') {
      const errorMessage: string = 'Name is required'
      setErrorMessage(errorMessage)
      return false
    }
    if (data.type === BlueprintEnum.ENTITY || data.type === undefined) {
      const errorMessage: string = 'Type is required'
      setErrorMessage(errorMessage)
      return false
    }
    return true
  }

  const get = ({ dataSourceId, documentId, attribute }: GetProps) => {
    return documentAPI.getById(dataSourceId, documentId, attribute)
  }

  // TODO: This cache does not really work, as a new instance of useExplorer is created in every form
  const getBlueprint = (typeRef: string) => {
    // Check if blueprint is in cache
    if (typeRef in blueprintCache) {
      console.log(`Found ${typeRef} in cache!`)
      return blueprintCache[typeRef]
    } else {
      const blueprint = documentAPI.getBlueprint(typeRef)
      //  Update cache
      setBlueprintCache({ ...blueprintCache, [typeRef]: blueprint })
      return blueprint
    }
  }

  const getByPath = ({ dataSourceId, path }: GetByPathProps) => {
    return documentAPI.getByPath(dataSourceId, path)
  }

  const toggle = ({ nodeId }: ToggleProps) => {
    index.models.index.operations
      .toggle(nodeId)
      .catch((error: any) =>
        setErrorMessage(`Could not toggle this document (${error})`)
      )
  }

  const open = ({ nodeId, dataSourceId, fetchUrl }: OpenProps) => {
    if (fetchUrl) {
      dashboard.models.layout.operations.add(
        fetchUrl.uid,
        fetchUrl.title,
        fetchUrl.component,
        {
          ...fetchUrl.data,
          documentId: fetchUrl.uid,
          dataSourceId: dataSourceId,
        }
      )
      dashboard.models.layout.operations.focus(nodeId)
    }
  }

  const create = async ({ data, dataUrl, nodeUrl }: CreateProps) => {
    if (validate(data)) {
      documentAPI
        .create(dataUrl, data)
        .then((result: any) => {
          closeModal()
          index.models.index.operations.add(result.uid, nodeUrl, true)
        })
        .catch((error: any) => {
          setErrorMessage(`Could not create document. Received error: ${error}`)
        })
    }
  }

  const addToParent = async ({
    dataSourceId,
    data,
    nodeUrl,
  }: AddToParentProps) => {
    if (validate(data)) {
      return documentAPI
        .addToParent(dataSourceId, data)
        .then((result: any) => {
          closeModal()
          index.models.index.operations.add(result.uid, nodeUrl, true)
          return result
        })
        .catch((error: any) => {
          setErrorMessage(`Not able to add element to document. (${error})`)
        })
    }
  }

  const remove = async ({ nodeId, parent, url, data }: RemoveProps) => {
    return documentAPI
      .remove(url, data)
      .then(() => {
        index.models.index.operations
          .remove(nodeId, parent)
          // @ts-ignore
          .then((result: any) => {
            dashboard.models.layout.operations.remove(nodeId)
            closeModal()
          })
        //todo: maybe add catech here? not it's possible though...
        return true
      })
      .catch((error: any) => {
        setErrorMessage(`Could not remove document. Received error: ${error}`)
      })
  }

  const update = async ({ data, updateUrl, nodeUrl }: UpdateProps) => {
    return documentAPI
      .update(updateUrl, data)
      .then((result: any) => {
        closeModal()
        index.models.index.operations
          .add(result.uid, nodeUrl)
          .then(() =>
            dashboard.models.layout.operations.refreshByFilter(result.uid)
          )
        //todo: maybe add a catch here? not sure if it's possible though...
      })
      .catch((error: any) =>
        setErrorMessage(`Could not update selected document. (${error})`)
      )
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
      .then((result: any) => {
        closeModal()
        index.models.index.operations
          .add(documentId, nodeUrl)
          .then(() =>
            dashboard.models.layout.operations.refreshByFilter(documentId)
          )
        return result
      })
      .catch((error: any) => {
        setErrorMessage(`Could not update selected document. (${error})`)
      })
  }

  return {
    get,
    getBlueprint,
    getByPath,
    toggle,
    open,
    create,
    remove,
    update,
    updateById,
    addToParent,
    index,
    dashboard,
    errorMessage,
  }
}
