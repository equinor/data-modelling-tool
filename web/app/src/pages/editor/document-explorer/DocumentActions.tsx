import React, { useState } from 'react'
import Prompt from '../../../components/Prompt'
import useRunnable from '../../../hooks/useRunnable'
import useExplorer, {
  IUseExplorer,
  RenameData,
} from '../../../hooks/useExplorer'
import {
  BlueprintEnum,
  BlueprintPicker,
  EntityPicker,
  Reference,
} from '@dmt/common'

export enum ContextMenuActions {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  DOWNLOAD = 'DOWNLOAD',
  RUNNABLE = 'RUNNABLE',
  INSERT_REFERENCE = 'INSERT_REFERENCE',
  UNLINK = 'UNLINK',
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

export interface IRenameDocument {
  explorer: IUseExplorer
  nodeUrl: string
  node: any
  dataSourceId: string
  documentId: string
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
  let defaultType: string = 'Click to select type to create'
  if (props.type !== BlueprintEnum.ENTITY) defaultType = props.type
  const [type, setType] = useState<string>(defaultType)
  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')

  const onSubmit = () => {
    props.explorer.create({
      data: {
        name: name,
        type: type,
        description: description || '',
        // @ts-ignore
        attribute: props.request.attribute,
        // @ts-ignore
        parentId: props.request.parentId,
      },
      dataUrl: props.url,
      nodeUrl: props.nodeUrl,
    })
  }

  const modalContent = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ margin: '10px 0' }}>
          <label style={{ marginRight: '10px' }}>Name: </label>
          <input
            disabled={false}
            value={name}
            onChange={(event) => setName(event.target.value)}
            style={{ width: '280px' }}
          />
        </div>
        <div
          style={{ marginTop: '10px', display: 'flex', flexDirection: 'row' }}
        >
          <label style={{ marginRight: '10px' }}>Type: </label>
          {/* If we are to create an "Entity", user should select type*/}
          {props.type === BlueprintEnum.ENTITY ? (
            <BlueprintPicker
              formData={type}
              onChange={(value: string) => setType(value)}
              uiSchema={{ 'ui:label': '' }}
            />
          ) : (
            <div>
              {/*todo - make sure that user can only select blueprints that
                extends the current "type". perhaps need to create an
                "ExtendsFromBlueprintPicker".
                */}
              <input disabled={true} value={type} style={{ width: '280px' }} />
              <div style={{ marginTop: '10px' }}>
                <label style={{ marginRight: '10px' }}>Override type? </label>

                <BlueprintPicker
                  formData={type}
                  onChange={(value: string) => setType(value)}
                  uiSchema={{ 'ui:label': '' }}
                />
              </div>
            </div>
          )}
        </div>
        <div style={{ marginTop: '10px' }}>
          <label style={{ marginRight: '10px' }}>Description: </label>
          <input
            disabled={false}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            style={{ width: '280px' }}
          />
        </div>
      </div>
    )
  }

  return (
    <Prompt
      onSubmit={() => onSubmit()}
      content={modalContent()}
      buttonText={'Create'}
    />
  )
}

// todo temprorary solution for form - can be replaced with react-jsonschema-form later
export const RenameDocument = (props: IRenameDocument) => {
  const [name, setName] = useState<string>(props.node.nodeData.title)
  const { explorer, nodeUrl, node, dataSourceId, documentId } = props

  const onSubmit = () => {
    const parentId: string = node.parent
    const renameData: RenameData = {
      name: name,
      parentId: node.nodeData.meta.isRootPackage ? null : parentId,
    }
    explorer.rename({ dataSourceId, documentId, nodeUrl, renameData })
  }

  const modalContent = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ margin: '10px 0' }}>
          <label style={{ marginRight: '10px' }}>New name: </label>
          <input
            disabled={false}
            value={name}
            onChange={(event) => setName(event.target.value)}
            style={{ width: '280px' }}
          />
        </div>
      </div>
    )
  }

  return (
    <Prompt
      onSubmit={() => onSubmit()}
      content={modalContent()}
      buttonText={'Update name'}
    />
  )
}

export const InsertReference = (props: IInsertReferenceProps) => {
  // TODO: Validate valid type from parent
  const { explorer, attribute, target, targetDataSource } = props
  const [refId, setRefID] = useState('')
  const [refName, setRefName] = useState('')
  const [refType, setRefType] = useState('')

  const updateDocument = () => {
    const reference: Reference = {
      name: refName,
      id: refId,
      type: refType,
    }
    explorer.insertReference({
      dataSourceId: targetDataSource,
      documentDottedId: `${target}.${attribute}`,
      reference,
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
              setRefID(reference.id)
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
  const { node, action, explorer } = props
  const { runAndSaveToExistingDocument } = useRunnable({ explorer })

  const handleRun = () => {
    runAndSaveToExistingDocument(
      node.nodeData.meta.dataSource,
      node.nodeData.nodeId,
      node.path,
      action.method,
      node.parent
    )
  }

  const prompt = {
    title: action.name,
    content: `Are you sure you want to run the function '${action.method}'?`,
    buttonText: 'Run',
  }

  return <Prompt onSubmit={handleRun} {...prompt} />
}
