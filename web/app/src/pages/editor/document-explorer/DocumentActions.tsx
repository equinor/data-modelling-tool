import React, { ChangeEvent, useEffect, useState } from 'react'
import Prompt from '../../../components/Prompt'
import useRunnable from '../../../hooks/useRunnable'
import useExplorer, { IUseExplorer } from '../../../hooks/useExplorer'
import { EntityPicker, Reference } from '@dmt/common'
// @ts-ignore
import { NotificationManager } from 'react-notifications'
export enum ContextMenuActions {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  DOWNLOAD = 'DOWNLOAD',
  RUNNABLE = 'RUNNABLE',
  INSERT_REFERENCE = 'INSERT_REFERENCE',
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

export interface IInsertReferenceProps {
  explorer: IUseExplorer
  attribute: string
  type: string
  target: string
  targetDataSource: string
}

// todo - temporary solution for create form - should be updated later
export interface IDefaultCreate {
  explorer: IUseExplorer
  type: string
  uiRecipeName: string
  onSubmit: (formdata: any) => void
  request: {}
  url: string
  nodeUrl: string
}

export const DefaultCreate = (props: IDefaultCreate) => {
  const [formData, updateFormData] = useState<any>({ type: props.type })
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const updateName = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
    updateFormData({ ...formData, name: event.target.value })
  }
  const updateDescription = (event: ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value)
    updateFormData({ ...formData, description: event.target.value })
  }

  const onSubmit = (formData: any) => {
    if (formData.description === undefined) {
      formData.description = ''
    }

    const output = {
      ...formData,
      // @ts-ignore
      attribute: props.request.attribute,
      // @ts-ignore
      parentId: props.request.parentId,
    }
    props.explorer.create({
      data: output,
      dataUrl: props.url,
      nodeUrl: props.nodeUrl,
    })
  }

  const modalContent = (
    updateName: (event: ChangeEvent<HTMLInputElement>) => void,
    updateDescription: (event: ChangeEvent<HTMLInputElement>) => void
  ) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ margin: '10px 0' }}>
          <label style={{ marginRight: '10px' }}>Name: </label>
          <input
            disabled={false}
            value={name}
            onChange={updateName}
            style={{ width: '280px' }}
          />
        </div>
        <div style={{ marginTop: '10px' }}>
          <label style={{ marginRight: '10px' }}>Type: </label>
          <input
            disabled={true}
            value={props.type}
            style={{ width: '280px' }}
          />
        </div>
        <div style={{ marginTop: '10px' }}>
          <label style={{ marginRight: '10px' }}>Description: </label>
          <input
            disabled={false}
            value={description}
            onChange={updateDescription}
            style={{ width: '280px' }}
          />
        </div>
      </div>
    )
  }

  return (
    <Prompt
      onSubmit={() => {
        onSubmit(formData)
      }}
      content={modalContent(updateName, updateDescription)}
      buttonText={'Create'}
    />
  )
}

export const InsertReference = (props: IInsertReferenceProps) => {
  const { explorer, attribute, type, target, targetDataSource } = props
  const [refId, setRefID] = useState('')
  const [refName, setRefName] = useState('')
  const [refType, setRefType] = useState('')

  const updateDocument = () => {
    const reference: Reference = {
      name: refName,
      _id: refId,
      type: refType,
    }
    explorer.updateById({
      dataSourceId: targetDataSource,
      documentId: target,
      attribute,
      data: reference,
      nodeUrl: target,
      reference: true,
    })
  }
  const modalContent = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginTop: '10px' }}>
          <label style={{ marginRight: '10px' }}>Type: </label>
          <input disabled={true} value={refType} style={{ width: '280px' }} />
        </div>
        <div style={{ margin: '10px 0' }}>
          <label style={{ marginRight: '10px' }}>Name: </label>
          <input disabled={true} value={refName} style={{ width: '280px' }} />
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginBottom: '15px',
          }}
        >
          <label style={{ marginRight: '10px' }}>_id:</label>
          <EntityPicker
            onChange={(reference: Reference) => {
              // TODO: Validate type based on parent
              setRefID(reference._id)
              setRefName(reference.name)
              setRefType(reference.type)
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <Prompt
      onSubmit={updateDocument}
      content={modalContent()}
      buttonText={'OK'}
    />
  )
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
