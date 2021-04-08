import React from 'react'
import Form from '../../../components/Form'
import Api2, { BASE_CRUD } from '../../../api/Api2'
// @ts-ignore
import { NotificationManager } from 'react-notifications'
import Prompt from '../../../components/Prompt'
import useRunnable from '../../../hooks/useRunnable'
import useExplorer from '../../../hooks/useExplorer'

export enum ContextMenuActions {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  DOWNLOAD = 'DOWNLOAD',
  RUNNABLE = 'RUNNABLE',
}

const fillTemplate = function(templateString: string, templateVars: object) {
  let func = new Function(
    ...Object.keys(templateVars),
    'return `' + templateString + '`;'
  )
  return func(...Object.values(templateVars))
}

interface Adict {
  [key: string]: string
}

const formDataGivenByRequest = (requestData: any, formData: any) => {
  const data = {} as any
  Object.keys(requestData).forEach(key => {
    if (key in formData) {
      data[key] = formData[key]
    } else if (typeof requestData[key] === 'object') {
      if (requestData[key] == null) {
        data[key] = null
      } else {
        const adict = {} as Adict
        for (const item_key in requestData[key]) {
          const value: string = requestData[key][item_key]
          if (item_key in formData) {
            const result = fillTemplate(value, formData)
            adict[item_key] = result
          }
        }
        data[key] = adict
      }
    } else {
      data[key] = fillTemplate(requestData[key], formData)
    }
  })
  return data
}

export const CreateAction = (props: any) => {
  const { action } = props
  const { create } = useExplorer({})

  const handleSubmit = (formData: any) => {
    const data = formDataGivenByRequest(action.action.data.request, formData)
    if (data.description === undefined) {
      data.description = ''
    }
    create({
      data: data,
      dataUrl: action.action.data.url,
      nodeUrl: action.action.data.nodeUrl,
    })
  }

  const fetchDocument = ({
    onSuccess,
    onError = () => {},
  }: BASE_CRUD): void => {
    Api2.get({
      url: action.action.data.schemaUrl,
      onSuccess: result => onSuccess({ template: result, document: {} }),
      onError,
    })
  }

  return (
    <Form
      fetchDocument={fetchDocument}
      onSubmit={(formData: any) => handleSubmit(formData)}
    />
  )
}

export const UpdateAction = (props: any) => {
  const { action } = props
  const { update } = useExplorer({})

  const handleSubmit = (formData: any) => {
    const data = formDataGivenByRequest(action.action.data.request, formData)
    if (data.description === undefined) {
      data.description = ''
    }
    update({
      data: data,
      updateUrl: action.action.data.url,
      nodeUrl: action.action.data.nodeUrl,
    })
  }

  const fetchDocument = ({
    onSuccess,
    onError = () => {},
  }: BASE_CRUD): void => {
    Api2.fetchWithTemplate({
      urlSchema: action.action.data.schemaUrl,
      urlData: action.action.data.dataUrl,
      onSuccess,
      onError,
    })
  }

  return (
    <Form
      fetchDocument={fetchDocument}
      onSubmit={(formData: any) => handleSubmit(formData)}
    />
  )
}

export const DeleteAction = (props: any) => {
  const { action } = props
  const { remove } = useExplorer({})

  const handleRemove = () => {
    remove({
      nodeId: action.node.nodeData.nodeId,
      parent: action.node.parent,
      url: action.action.data.url,
      data: action.action.data.request,
    })
  }

  const prompt = {
    title: 'Are you sure?',
    content: 'Would you like to remove this item?',
    buttonText: 'Delete',
  }

  return <Prompt onSubmit={handleRemove} {...prompt} />
}

export const DownloadAction = (props: any) => {
  const { action } = props

  const handleDownload = () => {
    window.open(action.action.data.url)
  }

  const prompt = {
    title: 'Create Application',
    content: 'Download the application',
    buttonText: 'Download',
    ...(action.action.data.prompt || {}),
  }

  return <Prompt onSubmit={handleDownload} {...prompt} />
}

export const SaveToExistingDocument = (props: any) => {
  const { action } = props

  const { runAndSaveToExistingDocument } = useRunnable()

  const handleRun = () => {
    runAndSaveToExistingDocument(
      action.action.data.dataSourceId,
      action.action.data.documentId,
      action.node.path,
      action.action.data.runnable.method,
      action.node.parent
    )
  }

  const prompt = {
    title: action.action.data.runnable.method,
    content: `Are you sure you want to run the function '${action.action.data.runnable.method}'?`,
    buttonText: 'Run',
  }

  return <Prompt onSubmit={handleRun} {...prompt} />
}

export const SaveToNewDocument = (props: any) => {
  const { action } = props

  const { runAndSaveToNewDocument } = useRunnable()

  const outputType = action.action.data.runnable.output

  const handleSubmit = async (formData: any) => {
    await runAndSaveToNewDocument(
      action.action.data.dataSourceId,
      action.action.data.documentId,
      action.node.path,
      formData,
      outputType,
      action.action.data.runnable.method
    )
  }
  const fetchDocument = ({
    onSuccess,
    onError = () => {},
  }: BASE_CRUD): void => {
    const blueprint = 'apps/DMT/actions/NewActionResult'
    const ui_recipe = 'DEFAULT_CREATE'
    Api2.get({
      // TODO: Use a standard CREATE_ENTITY schema
      url: `/api/v2/json-schema/${blueprint}?ui_recipe=${ui_recipe}`,
      onSuccess: result => onSuccess({ template: result, document: {} }),
      onError,
    })
  }
  return <Form fetchDocument={fetchDocument} onSubmit={handleSubmit} />
}
