import axios from 'axios'
import { BlueprintTreeViewActions } from '../tree-view/BlueprintTreeViewReducer'
import React, { useEffect, useState } from 'react'
import BlueprintForm from './BlueprintForm'
import toJsonSchema from 'to-json-schema'
import useAxios from '@use-hooks/axios'
import { NotificationManager } from 'react-notifications'

interface Props {
  dispatch: (action: {}) => void
  selectedBlueprintId: string
}

const EditBlueprintForm = (props: Props) => {
  const { dispatch, selectedBlueprintId } = props

  const { response, loading } = useAxios({
    url: `/api/blueprints/${selectedBlueprintId}`,
    method: 'GET',
    trigger: selectedBlueprintId,
    customHandler: error => {
      if (error) {
        NotificationManager.error(
          `${selectedBlueprintId}`,
          'Failed to fetch blueprint'
        )
      }
    },
  })

  if (loading) {
    return <div>Loading...</div>
  }

  const { data } = response || { data: {} }

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
        .then(function(response) {
          dispatch(BlueprintTreeViewActions.addFile(response.data, title))
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
      <BlueprintForm formData={data} onSubmit={onSubmit} />
    </>
  )
}

export default EditBlueprintForm
