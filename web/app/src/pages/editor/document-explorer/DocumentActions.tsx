import React from 'react'
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

const fillTemplate = function (templateString: string, templateVars: object) {
  // eslint-disable-next-line no-new-func
  let func = new Function(
    ...Object.keys(templateVars),
    'return `' + templateString + '`;'
  )
  return func(...Object.values(templateVars))
}

interface Adict {
  [key: string]: string
}

export const formDataGivenByRequest = (requestData: any, formData: any) => {
  const data = {} as any
  Object.keys(requestData).forEach((key) => {
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