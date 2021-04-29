import { useModalContext } from '../context/modal/ModalContext'
import { dmssApi } from '@dmt/common'
import Actions from '../actions'
// @ts-ignore
import { NotificationManager } from 'react-notifications'
import { createEntity } from '../utils/createEntity'
import { Entity } from '../domain/types'
import useExplorer, { IUseExplorer } from './useExplorer'

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
  parentId?: string
}

export type ActionProps = {
  input: Input
  output?: Output
  updateDocument?: Function
  createEntity?: Function
  explorer?: IUseExplorer
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

  const result = await dmssApi.documentGetById(requestParameters)
  const document = result.document

  const input: Input = {
    // @ts-ignore
    blueprint: document.type,
    // @ts-ignore
    entity: attribute ? document[attribute] : document,
    path: path,
    id: id,
    attribute: attribute,
  }

  return input
}

export default function useRunnable() {
  const { closeModal } = useModalContext()
  const explorer = useExplorer({})

  const updateDocument = async (output: Output, parentId: string) => {
    explorer
      .updateById({
        dataSourceId: output.dataSource,
        documentId: output.id,
        attribute: output.attribute || '',
        data: output.entity,
        nodeUrl: `/api/v4/index/${output.dataSource}/${
          parentId || output.parentId
        }`,
      })
      .then((result: any) => {
        output.notify &&
          NotificationManager.success(`Updated document: ${result.data.name}`)
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

    method({
      input,
      output,
      updateDocument: handleUpdate,
      createEntity,
      explorer,
    })

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

    const content = {
      attribute: 'content',
      // @ts-ignore
      description: data.description,
      name: data.name,
      parentId: destinationParentId,
      type: outputType,
    }

    explorer
      .addToParent({
        dataSourceId: destinationDataSourceId,
        data: content,
        nodeUrl: `/api/v4/index/${destinationDataSourceId}/${destinationParentId}`,
      })
      .then((result: any) => {
        const output: Output = {
          blueprint: data.type,
          entity: {
            // @ts-ignore
            _id: result.uid,
            type: outputType,
            name: data.name,
          },
          dataSource: destinationDataSourceId,
          // @ts-ignore
          id: result.uid,
        }

        const handleUpdateWithTreeUpdate = (output: any) => {
          handleUpdate(output, destinationParentId)
        }

        method({
          input,
          output,
          updateDocument: handleUpdateWithTreeUpdate,
          createEntity,
          explorer,
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
