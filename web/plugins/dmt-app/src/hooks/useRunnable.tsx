import Actions from '../../../../app/src/actions'
// @ts-ignore
import { NotificationManager } from 'react-notifications'
import { Entity } from '../domain/types'
import { IUseExplorer } from './useExplorer'
import { DmssAPI, DmtAPI } from '@dmt/common'

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

const dmtAPI = new DmtAPI()

export type Method = (props: ActionProps) => any

const getMethod = (methodToRun: string): Method => {
  // @ts-ignore
  if (!Actions[methodToRun]) {
    const message = `No runnable method "${methodToRun}" defined in "actions.js"`
    NotificationManager.error(message, 'Not Found')
    throw message
  }

  // @ts-ignore
  return Actions[methodToRun]
}

const getInput = async (
  dataSourceId: string,
  documentId: string,
  path: string,
  token: string
) => {
  const [id, attribute] = documentId.split('.', 2)
  let result: any = null
  const dmssAPI = new DmssAPI(token)
  if (attribute) {
    // Use attribute if the document is contained in another document
    result = await dmssAPI.getDocumentById({
      dataSourceId,
      documentId,
      attribute,
    })
  } else {
    result = await dmssAPI.getDocumentById({ dataSourceId, documentId })
  }

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

export default function useRunnable({ explorer }: any) {
  const updateDocument = async (output: Output, parentId: string) => {
    output.notify && NotificationManager.warning(`Action started....`, 'Action')
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
          NotificationManager.success(
            `Updated document: ${JSON.parse(result).data.name}`,
            'Updated'
          )
      })
      .catch((error: any) => {
        NotificationManager.error(
          `Failed to update document: ${error}`,
          'Action Failed'
        )
      })
  }

  const runAndSaveToExistingDocument = async (
    dataSourceId: string,
    documentId: string,
    path: string,
    methodToRun: string,
    parentId: string,
    token: string
  ) => {
    const method: Method = getMethod(methodToRun)
    const input: Input = await getInput(dataSourceId, documentId, path, token)
    const output: Output = {
      blueprint: input.blueprint,
      entity: input.entity,
      dataSource: dataSourceId,
      id: input.id,
      attribute: input.attribute,
      notify: true,
      // @ts-ignore
      parentId: parentId,
    }
    const createEntity = (type: string) => dmtAPI.createEntity(type, token)
    method({
      input,
      output,
      updateDocument: (output: Output) => updateDocument(output, parentId),
      createEntity,
      explorer,
    })
  }

  const runAndSaveToNewDocument = async (
    dataSourceId: string,
    documentId: string,
    path: string,
    data: any,
    outputType: string,
    methodToRun: string,
    token: string
  ) => {
    const method: Method = getMethod(methodToRun)
    const input: Input = await getInput(dataSourceId, documentId, path, token)

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
          notify: true,
          dataSource: destinationDataSourceId,
          // @ts-ignore
          id: result.uid,
        }
        const createEntity = dmtAPI.createEntity
        method({
          input,
          output,
          updateDocument: (output: any) =>
            updateDocument(output, destinationParentId),
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
  }

  return {
    runAndSaveToExistingDocument,
    runAndSaveToNewDocument,
  }
}
