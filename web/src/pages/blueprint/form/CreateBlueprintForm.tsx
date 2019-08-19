import React from 'react'
import axios from 'axios'
//@ts-ignore
import { NotificationManager } from 'react-notifications'
import BlueprintForm from './BlueprintForm'
import { BlueprintActions, BlueprintState } from '../BlueprintReducer'

interface Props {
  dispatch: (action: any) => void
  state: BlueprintState
}

export default (props: Props) => {
  const {
    dispatch,
    state: { selectedBlueprintId },
  } = props

  const onSubmit = (schemas: any) => {
    const title = schemas.formData.title

    let url = `api/blueprints/${selectedBlueprintId.replace('package', title)}`

    axios
      .put(url, schemas.formData)
      .then(function(response) {
        NotificationManager.success(response.data, 'Created blueprint')
        dispatch(BlueprintActions.addFile(response.data, title))
      })
      .catch(e => {
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
