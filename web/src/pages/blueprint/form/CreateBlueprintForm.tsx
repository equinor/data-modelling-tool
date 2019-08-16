import React from 'react'
import axios from 'axios'
//@ts-ignore
import { NotificationManager } from 'react-notifications'
import { BlueprintTreeViewActions } from '../tree-view/BlueprintTreeViewReducer'
import BlueprintForm from './BlueprintForm'
import { BlueprintState } from '../BlueprintReducer'

interface Props {
  dispatchTreeview: (action: {}) => void
  state: BlueprintState
}

export default (props: Props) => {
  const {
    dispatchTreeview,
    state: { selectedBlueprintId },
  } = props

  const onSubmit = (schemas: any) => {
    const title = schemas.formData.title

    let url = `api/blueprints/${selectedBlueprintId.replace('package', title)}`

    axios
      .put(url, schemas.formData)
      .then(function(response) {
        NotificationManager.success(response.data, 'Created blueprint')
        dispatchTreeview(BlueprintTreeViewActions.addFile(response.data, title))
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
