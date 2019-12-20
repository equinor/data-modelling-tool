import React, { useEffect } from 'react'
import Api2 from '../../../api/Api2'
import { EditPlugin } from '../../../plugins'
//@ts-ignore
import { NotificationManager } from 'react-notifications'

type Props = {
  fetchDocument: Function
  setLoading: Function
  setShowModal: Function
  setDocumentData: Function
  nodeData: any
  formProps: any
  parent: string
}

export function ActionEditPlugin(props: Props) {
  const { nodeData, parent } = props
  const {
    formProps: { fetchDocument },
    setShowModal,
  } = props
  //@todo use blueprint provider to get import action blueprint with uiRecipe.
  useEffect(() => {}, [fetchDocument])

  return (
    <EditPlugin
      rootDocument={getImportActionBlueprint()}
      blueprintType={getImportActionBlueprint()}
      document={{
        name: '',
        type: '',
        description: '',
      }}
      blueprintTypes={[]}
      dtos={[]}
      uiRecipe={getImportActionBlueprint().uiRecipes[0]}
      onSubmit={(schemas: any) => {
        if (schemas.formData.filepath) {
          const content: any = JSON.parse(schemas.formData.filepath)
          const data = content.filter((item: any) => {
            //supports only one level
            if (schemas.formData.onlyCurrentFolder) {
              return item.path.split('/').length === 2
            }
            return true
          })
          Api2.post({
            url: '/api/v3/actions',
            data: {
              action: 'UPLOAD',
              dataSource: parent, //only rootpackages can have import.
              parentId: nodeData.nodeId,
              data,
            },
            onSuccess: (res: any) => {
              NotificationManager.success('', `Uploaded ${data.length} files.`)
              setShowModal(false)
            },
            onError: (err: any) => {
              console.log(err)
            },
          })
        }
      }}
    />
  )
}

function getImportActionBlueprint() {
  return {
    name: 'ImportAction',
    type: 'system/SIMOS/Blueprint',
    description: 'This describes a import action',
    attributes: [
      {
        type: 'string',
        name: 'name',
      },
      {
        type: 'string',
        name: 'type',
      },
      {
        type: 'string',
        name: 'description',
      },
      {
        type: 'string',
        name: 'filepath',
        label: 'Folder',
        description: 'the folder on the local machine.',
      },
      {
        type: 'boolean',
        name: 'onlyCurrentFolder',
        default: 'false',
      },
    ],
    storageRecipes: [],
    uiRecipes: [
      {
        name: 'Import',
        plugin: 'EDIT_PLUGIN',
        type: 'system/SIMOS/UiRecipe',
        attributes: [
          {
            name: 'name',
            widget: 'hidden',
          },
          {
            name: 'type',
            widget: 'hidden',
          },
          {
            name: 'description',
            widget: 'hidden',
          },
          {
            name: 'filepath',
            type: 'system/SIMOS/UiAttribute',
            widget: 'fileUploadWidget',
            required: true,
          },
          {
            name: 'onlyCurrentFolder',
            type: 'system/SIMOS/UiAttribute',
            helpText:
              'Upload a flat package structure. Nested folders are not supported. Uncheck onlyCurrentFolder will not upload subfolders.',
          },
        ],
      },
    ],
  }
}
