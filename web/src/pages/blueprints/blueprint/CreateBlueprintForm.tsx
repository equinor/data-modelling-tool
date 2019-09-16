import React from 'react'
import axios from 'axios'
//@ts-ignore
import { NotificationManager } from 'react-notifications'
import BlueprintForm from './BlueprintForm'
import { DocumentsState } from '../../common/DocumentReducer'
import { DmtApi } from '../../../api/Api'
import { DocumentData } from './FetchDocument'
const api = new DmtApi()

interface Props {
  data?: DocumentData
  dispatch: (action: any) => void
  state: DocumentsState
}

export default (props: Props) => {
  const {
    state: { currentDatasourceId, selectedDocumentId },
  } = props

  const onSubmit = (schemas: any) => {
    const url = api.documentPut(currentDatasourceId)
    axios
      .put(url, schemas.formData)
      .then((response: any) => {
        //@todo implement when api return correct response. issue #92
        // dispatch(EntitiesActions.addFile(response.data))
        NotificationManager.success(response.data, 'Created blueprint')
      })
      .catch((e: any) => {
        NotificationManager.error(
          'Failed to create blueprint',
          'Created blueprint'
        )
      })
  }

  return (
    <>
      <h3>Create blueprint</h3>
      <BlueprintForm
        data={{ formData: {}, template: {}, uiSchema: {} }}
        onSubmit={onSubmit}
      />
    </>
  )
}
