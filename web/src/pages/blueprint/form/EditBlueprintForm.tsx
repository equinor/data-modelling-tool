import axios from 'axios'
import React from 'react'
import BlueprintForm from './BlueprintForm'
//@ts-ignore
import toJsonSchema from 'to-json-schema'
//@ts-ignore
import { NotificationManager } from 'react-notifications'
import useFetch from '../../../components/useFetch'

interface Props {
  selectedBlueprintId: string
}

const EditBlueprintForm = (props: Props) => {
  const { selectedBlueprintId } = props

  const [loading, formData, error] = useFetch(
    `/api/blueprints/${selectedBlueprintId}`
  )
  if (error) {
    NotificationManager.error(``, 'Failed to fetch blueprint template')
  }

  if (loading) {
    return <div>Loading...</div>
  }

  const onSubmit = (schemas: any) => {
    const title = schemas.formData.title

    try {
      //validate jsonSchema.
      toJsonSchema(schemas.formData)
      if (!title) {
        alert('jsonschema has no title.')
        return
      }

      const url = `api/blueprints/${selectedBlueprintId}`

      axios
        .put(url, schemas.formData)
        .then(response => {
          NotificationManager.success(response.data, 'Updated blueprint')
        })
        .catch(e => {
          console.error(e)
        })
    } catch (e) {
      //todo fix validation. Set required on fields. And strip optional fields with null values from formdata.
      alert('not valid jsonschema')
    }
  }

  return (
    <>
      <h3>Edit Blueprint</h3>
      <BlueprintForm formData={formData} onSubmit={onSubmit} />
    </>
  )
}

export default EditBlueprintForm
