import React from 'react'
import ReactJsonSchemaPlugin from '../../../plugins/form/Form'
import axios from 'axios'
//@ts-ignore
import { NotificationManager } from 'react-notifications'
import FetchDocument from '../utils/FetchDocument'

interface Props {
  dataUrl: string
  schemaUrl: string
  document: any
  attribute: string
  uiRecipe: string
}

const ReactJsonSchemaWrapper = (props: Props) => {
  const { document, schemaUrl, dataUrl, attribute, uiRecipe } = props

  const onSubmit = (schemas: any) => {
    const url = attribute ? `${dataUrl}/${attribute}` : dataUrl
    axios
      .put(url, schemas.formData)
      .then((response: any) => {
        const responseData: any = response.data
        NotificationManager.success(responseData.data.uid, 'Updated blueprint')
      })
      .catch((e: any) => {
        console.log(e)
        NotificationManager.error(
          'Failed to update blueprint',
          'Updated blueprint'
        )
      })
  }

  return (
    <FetchDocument
      url={`${schemaUrl}?ui_recipe=${uiRecipe}`}
      render={(data: any) => {
        return (
          <ReactJsonSchemaPlugin
            document={document}
            template={data}
            onSubmit={onSubmit}
          />
        )
      }}
    />

    // <>
    //   <h3>Edit Blueprint</h3>
    //   <ReactJsonSchemaPlugin
    //     template={template}
    //     document={document}
    //     onSubmit={onSubmit}
    //   />
    // </>
  )
}

export default ReactJsonSchemaWrapper
