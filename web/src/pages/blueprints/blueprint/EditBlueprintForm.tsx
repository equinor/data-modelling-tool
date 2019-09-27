import React from 'react'
import BlueprintForm from './BlueprintForm'
import axios from 'axios'
//@ts-ignore
import { NotificationManager } from 'react-notifications'
import { DocumentActions, DocumentsState } from '../../common/DocumentReducer'
import { DmtApi } from '../../../api/Api'
import { DocumentData } from './FetchDocument'
const api = new DmtApi()
interface Props {
  documentId: string
  dispatch: Function
  documentData: DocumentData
}

const EditBlueprintForm = (props: Props) => {
  const { documentData, dispatch, documentId } = props

  const onSubmit = (schemas: any) => {
    const url = api.updateDocument(documentId)
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
