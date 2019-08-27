import React from 'react'
import axios from 'axios'
//@ts-ignore
import { NotificationManager } from 'react-notifications'
import BlueprintForm from './BlueprintForm'
import { BlueprintState } from '../BlueprintReducer'
import { DmtApi } from '../../../api/Api'
const api = new DmtApi()

interface Props {
  dispatch: (action: any) => void
  state: BlueprintState
}

export default (props: Props) => {
  const {
    state: { selectedDatasourceId, selectedBlueprintId },
  } = props

  const onSubmit = (schemas: any) => {
    const url = api.documentPut(selectedDatasourceId, selectedBlueprintId)
    axios
      .put(url, schemas.formData)
      .then((response: any) => {
        //@todo implement when api return correct response. issue #92
        // dispatch(BlueprintActions.addFile(response.data))
        NotificationManager.success(response.data, 'Created blueprint')
      })
      .catch((e: any) => {
        NotificationManager.error(
          'Failed to crate blueprint',
          'Created blueprint'
        )
      })
  }

  return (
    <>
      <h3>Create blueprint</h3>
      <BlueprintForm formData={{}} onSubmit={onSubmit} />
    </>
  )
}
