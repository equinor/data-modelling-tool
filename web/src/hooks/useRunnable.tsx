import { IIndex, useIndex } from '../context/index/IndexProvider'
import {
  IDashboard,
  useDashboard,
} from '../context/dashboard/DashboardProvider'
import { useModalContext } from '../context/modal/ModalContext'
import { useContext } from 'react'
import { StatusContext } from '../context/status/StatusContext'
import { documentAPI, ExplorerAPI } from '../api/StorageServiceAPI'
import Actions from '../actions'
// @ts-ignore
import { NotificationManager } from 'react-notifications'
import { createEntity } from './utils/createEntity'
import { Entity } from '../domain/types'

export enum ActionTypes {
  separateResultFile = 'separateResultFile',
  resultInEntity = 'resultInEntity',
}

export interface Runnable {
  name: string
  type: string
  description: string
  actionType: string
  input: string
  output: string
  method: string
}

export type Input = {
  blueprint: any
  entity: Entity
  path: string
  id: string
  attribute?: string
}

export type Output = {
  blueprint: any
  entity: any
  dataSource: string
  id: string
  notify?: Boolean
  attribute?: string
}

export type ActionProps = {
  input: Input
  output?: Output
  updateDocument?: Function
  createEntity?: Function
}

export type Method = (props: ActionProps) => any

const getMethod = (methodToRun: string): Method => {
  // @ts-ignore
  if (!Actions[methodToRun]) {
    const message = `Runnable Method "${methodToRun}"`
    NotificationManager.error(message, 'Not Found')
    throw message
  }

  // @ts-ignore
  return Actions[methodToRun]
}

const getInput = async (
  dataSourceId: string,
  documentId: string,
  path: string
) => {
  const [id, attribute] = documentId.split('.', 2)
  const requestParameters = {
    dataSourceId,
    documentId: id,
  }
  if (attribute) {
    // Use attribute if the document is contained in another document
    // @ts-ignore
    requestParameters['attribute'] = attribute
  }

  const result = await documentAPI.getById(requestParameters)

  const document = result.document

  const input: Input = {
    // @ts-ignore
    blueprint: document.type,
    // @ts-ignore
    entity: document,
    path: path,
    id: id,
    attribute: attribute,
  }

  return input
}

export default function useRunnable() {
  const index: IIndex = useIndex()

  const { closeModal } = useModalContext()

  const dashboard: IDashboard = useDashboard()

  const [status, setStatus] = useContext(StatusContext)

  const updateDocument = async (output: Output, parentId: string) => {
    const updateData: any = {
      documentId: output.id,
      dataSourceId: output.dataSource,
      requestBody: output.entity,
    }

    if (output.attribute) {
      updateData['attribute'] = output.attribute
    }

    documentAPI
      .update(updateData)
      .then((response: any) => {
        dashboard.models.layout.operations.refreshByFilter(output.id)
        output.notify &&
          NotificationManager.success(`Updated document: ${response.name}`)
        index.operations.add(
          `${output.id}`,
          // @ts-ignore
          `/api/v4/index/${output.dataSource}/${parentId || output.parentId}`,
          true
        )
      })
      .catch((error: any) => {
        NotificationManager.error(`Failed to update document: ${error}`)
      })
  }

  async function handleUpdate(output: Output, parentId: string) {
    await updateDocument(output, parentId)
  }

  const runAndSaveToExistingDocument = async (
    dataSourceId: string,
    documentId: string,
    path: string,
    methodToRun: string,
    parentId: string
  ) => {
    const method: Method = getMethod(methodToRun)
    const input: Input = await getInput(dataSourceId, documentId, path)

    const output: Output = {
      blueprint: input.blueprint,
      entity: input.entity,
      dataSource: dataSourceId,
      id: input.id,
      attribute: input.attribute,
      // @ts-ignore
      parentId: parentId,
    }

    method({ input, output, updateDocument: handleUpdate, createEntity })

    closeModal()
  }

  const runAndSaveToNewDocument = async (
    dataSourceId: string,
    documentId: string,
    path: string,
    data: any,
    outputType: string,
    methodToRun: string
  ) => {
    const method: Method = getMethod(methodToRun)
    const input: Input = await getInput(dataSourceId, documentId, path)

    const [
      destinationDataSourceId,
      destinationParentId,
    ] = data.destination.split('/', 2)

    // Create the result file
    await ExplorerAPI.addToParent({
      // @ts-ignore
      dataSourceId: destinationDataSourceId,
      inlineObject: {
        attribute: 'content',
        // @ts-ignore
        description: data.description,
        name: data.name,
        parentId: destinationParentId,
        type: outputType,
      },
    })
      .then((response: any) => {
        index.operations.add(
          `${response.uid}`,
          `/api/v4/index/${destinationDataSourceId}/${destinationParentId}`,
          true
        )

        const output: Output = {
          blueprint: data.type,
          entity: {
            // @ts-ignore
            _id: response.uid,
            type: outputType,
            name: data.name,
          },
          dataSource: destinationDataSourceId,
          // @ts-ignore
          id: response.uid,
        }

        const handleUpdateWithTreeUpdate = (output: any) => {
          handleUpdate(output, destinationParentId)
        }

        method({
          input,
          output,
          updateDocument: handleUpdateWithTreeUpdate,
          createEntity,
        })
      })
      .catch((error: any) => {
        console.error(error)
        NotificationManager.error(
          `Failed to create new result file: ${error?.response?.message}`
        )
      })

    closeModal()
  }

  return {
    runAndSaveToExistingDocument,
    runAndSaveToNewDocument,
  }
}
