import {
  IDashboard,
  useDashboard,
} from '../context/dashboard/DashboardProvider'
import { useModalContext } from '../context/modal/ModalContext'
// @ts-ignore
import { NotificationManager } from 'react-notifications'
import {
  BlueprintEnum,
  DmssAPI,
  DocumentGetByIdRequest,
  Reference,
  AuthContext,
} from '@dmt/common'

import {
  IGlobalIndex,
  useGlobalIndex,
} from '../context/global-index/IndexProvider'
import { useContext, useEffect, useState } from 'react'
import { LayoutComponents } from '../context/dashboard/useLayout'

interface FetchUrl {
  uid: string
  data: object
  title: string
  component: LayoutComponents
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

interface InsertReferenceProps {
  dataSourceId: string
  documentDottedId: string
  reference: Reference
}

interface RemoveReferenceProps {
  dataSourceId: string
  documentDottedId: string
}

interface RemoveProps {
  nodeId: string
  parent: string
  url: string
}

interface UpdateByIdProps {
  dataSourceId: string
  documentId: string
  attribute: string
  data: any
  nodeUrl?: string
}

interface renameProps {
  dataSourceId: string
  documentId: string
  nodeUrl: string
  renameData: RenameData
}

export type RenameData = {
  name: string
  parentId: string | null
}

export type RenameRequest = {
  name: string
  parentId?: string
  documentId: string
  dataSourceId?: string
}

export interface IUseExplorer {
  index: IGlobalIndex
  dashboard: IDashboard
  errorMessage: String | null

  get(props: DocumentGetByIdRequest): void

  insertReference({
    dataSourceId,
    documentDottedId,
    reference,
  }: InsertReferenceProps): void

  removeReference({
    dataSourceId,
    documentDottedId,
  }: RemoveReferenceProps): void

  getBlueprint(typeRef: string): void

  getByPath({ dataSourceId, path }: GetByPathProps): void

  toggle({ nodeId }: ToggleProps): void

  open({ nodeId, dataSourceId, fetchUrl }: OpenProps): void

  create({ data, dataUrl, nodeUrl }: CreateProps): void

  remove({ nodeId, parent, url }: RemoveProps): void

  rename({ dataSourceId, documentId, nodeUrl, renameData }: renameProps): void

  updateById({
    dataSourceId,
    documentId,
    attribute,
    data,
    nodeUrl,
  }: UpdateByIdProps): Promise<any>

  addToParent({ dataSourceId, data, nodeUrl }: AddToParentProps): Promise<any>
}

export default function useExplorer(dmssAPI: DmssAPI): IUseExplorer {
  const [blueprintCache, setBlueprintCache] = useState<any>({})
  const dashboard: IDashboard = useDashboard()
  const index: IGlobalIndex = useGlobalIndex()
  const { closeModal } = useModalContext()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [errorCounter, setErrorCounter] = useState<number>(0)
  const { token } = useContext(AuthContext)

  useEffect(() => {
    if (errorMessage) {
      NotificationManager.error(errorMessage, 'Error', 0)
    }
  }, [errorMessage, errorCounter])

  const validate = (data: any) => {
    if (data.name === undefined || data.name === '') {
      const errorMessage: string = 'Name is required'
      setErrorMessage(errorMessage)
      return false
    }
    if (
      data.type === BlueprintEnum.ENTITY ||
      data.type === undefined ||
      data.type === 'Click to select type to create'
    ) {
      const errorMessage: string = 'Type is required'
      setErrorMessage(errorMessage)
      return false
    }
    return true
  }

  const get = (props: DocumentGetByIdRequest) => {
    return dmssAPI.getDocumentById(props)
  }

  // TODO: This cache does not really work, as a new instance of useExplorer is created in every form
  const getBlueprint = (typeRef: string) => {
    // Check if blueprint is in cache
    if (typeRef in blueprintCache) {
      return blueprintCache[typeRef]
    } else {
      const blueprint = dmssAPI.getBlueprint({ typeRef })
      //  Update cache
      setBlueprintCache({ ...blueprintCache, [typeRef]: blueprint })
      return blueprint
    }
  }

  const getByPath = ({ dataSourceId, path }: GetByPathProps) => {
    return dmssAPI.documentGetByPath({ dataSourceId, path })
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
      dmssAPI
        .createDocument(dataUrl, data, token)
        .then((result: any) => {
          closeModal()
          index.models.index.operations.add(result.uid, nodeUrl, true)
        })
        .catch((error: any) => {
          setErrorMessage(`Could not create document. Received error: ${error}`)
          setErrorCounter(errorCounter + 1)
        })
    }
  }
  const insertReference = async ({
    dataSourceId,
    documentDottedId,
    reference,
  }: InsertReferenceProps) => {
    dmssAPI
      .insertDocumentReference({ dataSourceId, documentDottedId, reference })
      .then(() => {
        closeModal()
        const rootDocumentId = documentDottedId.split('.', 1)[0]
        index.models.index.operations
          .add(
            documentDottedId,
            `/api/v4/index/${dataSourceId}/${rootDocumentId}`,
            true
          )
          .then(() => {
            dashboard.models.layout.operations.refresh(rootDocumentId)
            toggle({ nodeId: rootDocumentId })
          })
      })
      .catch((error: any) => {
        setErrorMessage(`Failed to insert reference. Received error: ${error}`)
        setErrorCounter(errorCounter + 1)
      })
  }

  const removeReference = async ({
    dataSourceId,
    documentDottedId,
  }: RemoveReferenceProps) => {
    dmssAPI
      .removeDocumentReference({ dataSourceId, documentDottedId })
      .then(() => {
        const rootDocumentId = documentDottedId.split('.', 1)[0]
        index.models.index.operations
          .remove(documentDottedId, rootDocumentId)
          .then(() =>
            dashboard.models.layout.operations.remove(documentDottedId)
          )
      })
      .catch((error: any) => {
        setErrorMessage(`Failed to remove reference. Received error: ${error}`)
        setErrorCounter(errorCounter + 1)
      })
  }

  const addToParent = async ({
    dataSourceId,
    data,
    nodeUrl,
  }: AddToParentProps) => {
    if (validate(data)) {
      return dmssAPI
        .addDocumentToParent({ dataSourceId, dottedId: nodeUrl, body: data })
        .then((result: any) => {
          closeModal()
          const res = JSON.parse(result)
          index.models.index.operations.add(res.uid, nodeUrl, true)
          return res
        })
        .catch((error: any) => {
          setErrorMessage(`Not able to add element to document. (${error})`)
          setErrorCounter(errorCounter + 1)
        })
    }
  }

  const remove = async ({ nodeId, parent, url }: RemoveProps) => {
    return dmssAPI
      .removeDocument(url, token)
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
        setErrorCounter(errorCounter + 1)
      })
  }

  const rename = async ({
    dataSourceId,
    documentId,
    nodeUrl,
    renameData,
  }: renameProps) => {
    let renameRequest: RenameRequest
    if (renameData.parentId) {
      renameRequest = {
        name: renameData.name,
        parentId: renameData.parentId,
        documentId: documentId,
        dataSourceId: dataSourceId,
      }
    } else {
      renameRequest = {
        name: renameData.name,
        documentId: documentId,
        dataSourceId: dataSourceId,
      }
    }
    NotificationManager.warning(
      'Rename feature is not maintained and can have bugs...'
    )
    return dmssAPI
      .explorerDocumentRename({ dataSourceId, renameRequest })
      .then((result: any) => {
        closeModal()
        index.models.index.operations
          .add(documentId, nodeUrl)
          .then(() =>
            dashboard.models.layout.operations.refreshByFilter(documentId)
          )
      })
      .catch((error: any) => {
        setErrorMessage(`Could not rename selected document. (${error})`)
        setErrorCounter(errorCounter + 1)
      })
  }

  const updateById = async ({
    dataSourceId,
    documentId,
    attribute,
    data,
    nodeUrl,
  }: UpdateByIdProps) => {
    const dataAsString = JSON.stringify(data)
    return dmssAPI
      .updateDocumentById({
        dataSourceId,
        documentId,
        attribute,
        data: dataAsString,
      })
      .then((result: any) => {
        closeModal()
        if (nodeUrl) {
          index.models.index.operations
            .add(documentId, nodeUrl)
            .then(() =>
              dashboard.models.layout.operations.refreshByFilter(documentId)
            )
        }
        return result
      })
      .catch((error: any) => {
        setErrorMessage(`Could not update selected document. (${error})`)
        setErrorCounter(errorCounter + 1)
      })
  }

  return {
    get,
    insertReference,
    removeReference,
    getBlueprint,
    getByPath,
    toggle,
    open,
    create,
    remove,
    updateById,
    rename,
    addToParent,
    index,
    dashboard,
    errorMessage,
  }
}
