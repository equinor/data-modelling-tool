import React from 'react'
import BlueprintForm from './BlueprintForm'
import axios from 'axios'
//@ts-ignore
import { NotificationManager } from 'react-notifications'
import { DocumentActions, DocumentsState } from '../../common/DocumentReducer'
import { DmtApi } from '../../../api/Api'
import useFetch from '../../../components/useFetch'
const api = new DmtApi()
interface Props {
  state: DocumentsState
  dispatch: Function
}

const notifications = {
  failureNotification: {
    title: '',
    body: 'Failed to fetch blueprint data',
  },
}

const EditBlueprintForm = (props: Props) => {
  const {
    dispatch,
    state: { selectedDocumentId },
  } = props

  const [dataLoading, formData] = useFetch(
    api.documentGet(selectedDocumentId),
    notifications
  )

  if (dataLoading) {
    return <div>Loading...</div>
  }

  const onSubmit = (schemas: any) => {
    const url = api.documentPut(selectedDocumentId)
    axios
      .put(url, schemas.formData)
      .then((response: any) => {
        NotificationManager.success(response.data, 'Updated blueprint')
        dispatch(DocumentActions.viewFile(selectedDocumentId))
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
      <BlueprintForm formData={formData.formData} onSubmit={onSubmit} />
    </>
  )
}

export default EditBlueprintForm
