import React from 'react'
import axios from 'axios'
//@ts-ignore
import toJsonSchema from 'to-json-schema'
//@ts-ignore
import { NotificationManager } from 'react-notifications'
import { BlueprintTreeViewActions } from '../tree-view/BlueprintTreeViewReducer'
import BlueprintForm from './BlueprintForm'

interface Props {
  dispatch: (action: {}) => void
  selectedBlueprintId: string
}

const CreateBlueprintForm = (props: Props) => {
  const { dispatch, selectedBlueprintId } = props

  const onSubmit = (schemas: any) => {
    const title = schemas.formData.title

    try {
      //validate jsonSchema.
      toJsonSchema(schemas.formData)
      if (!title) {
        alert('jsonschema has no title.')
        return
      }

      let url = `api/blueprints/${selectedBlueprintId.replace(
        'package',
        title
      )}`

      axios
        .put(url, schemas.formData)
        .then(function(response) {
          NotificationManager.error(response.data, 'Created blueprint')
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
      <h3>Create blueprint</h3>
      <BlueprintForm formData={{}} onSubmit={onSubmit} />
    </>
  )
}

export default CreateBlueprintForm
