import React from 'react'
import BlueprintForm from './BlueprintForm'
import axios from 'axios'
//@ts-ignore
import { NotificationManager } from 'react-notifications'
import { BlueprintActions, BlueprintState } from '../BlueprintReducer'
import { DmtApi } from '../../../api/Api'
import useFetch from '../../../components/useFetch'
const api = new DmtApi()
interface Props {
  state: BlueprintState
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
    state: { selectedBlueprintId, selectedDatasourceId },
  } = props

  const [dataLoading, formData] = useFetch(
    api.documentGet(selectedDatasourceId, selectedBlueprintId),
    notifications
  )

  if (dataLoading) {
    return <div>Loading...</div>
  }

  const onSubmit = (schemas: any) => {
    const url = api.documentPut(selectedDatasourceId, selectedBlueprintId)
    axios
      .put(url, schemas.formData)
      .then((response: any) => {
        NotificationManager.success(response.data, 'Updated blueprint')
        dispatch(BlueprintActions.viewFile(selectedBlueprintId))
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
      <BlueprintForm formData={formData} onSubmit={onSubmit} />
    </>
  )
}

export default EditBlueprintForm
