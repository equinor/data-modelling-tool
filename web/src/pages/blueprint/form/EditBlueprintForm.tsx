import axios from 'axios'
import React from 'react'
import BlueprintForm from './BlueprintForm'
//@ts-ignore
import { NotificationManager } from 'react-notifications'
import useFetch from '../../../components/useFetch'
import { BlueprintState } from '../BlueprintReducer'

interface Props {
  state: BlueprintState
}

const EditBlueprintForm = (props: Props) => {
  const {
    state: { dataUrl },
  } = props

  const [loading, formData, error] = useFetch(dataUrl)
  if (error) {
    NotificationManager.error(``, 'Failed to fetch blueprint template')
  }

  if (loading) {
    return <div>Loading...</div>
  }

  const onSubmit = (schemas: any) => {
    const url = dataUrl

    axios
      .put(url, schemas.formData)
      .then(response => {
        NotificationManager.success(response.data, 'Updated blueprint')
      })
      .catch(e => {
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
