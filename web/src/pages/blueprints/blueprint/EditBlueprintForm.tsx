import React from 'react'
import BlueprintForm from './BlueprintForm'
import axios from 'axios'
//@ts-ignore
import { NotificationManager } from 'react-notifications'
import { DocumentData } from './types'
interface Props {
  dataUrl: string
  dispatch: Function
  documentData: DocumentData
  attribute: string
}

const EditBlueprintForm = (props: Props) => {
  const { documentData, dataUrl, attribute } = props

  const onSubmit = (schemas: any) => {
    const url = attribute ? `${dataUrl}/${attribute}` : dataUrl
    axios
      .put(url, schemas.formData)
      .then((response: any) => {
        const responseData: DocumentData = response.data
        NotificationManager.success(
          responseData.document.id,
          'Updated blueprint'
        )
        // dispatch(DocumentActions.viewFile(documentId))
      })
      .catch((e: any) => {
        NotificationManager.error(
          'Failed to update blueprint',
          'Updated blueprint'
        )
      })
  }

  return (
    <>
      <h3>Edit Blueprint</h3>
      <BlueprintForm documentData={documentData} onSubmit={onSubmit} />
    </>
  )
}

export default EditBlueprintForm
