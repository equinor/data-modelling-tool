import React from 'react'
import ReactJsonSchemaPlugin from '../../../plugins/form/Form'
import axios from 'axios'
//@ts-ignore
import { NotificationManager } from 'react-notifications'

interface Props {
  dataUrl: string
  document: any
  template: any
  attribute: string
}

const ReactJsonSchemaWrapper = (props: Props) => {
  const { document, template, dataUrl, attribute } = props

  const onSubmit = (schemas: any) => {
    const url = attribute ? `${dataUrl}/${attribute}` : dataUrl
    axios
      .put(url, schemas.formData)
      .then((response: any) => {
        const responseData: any = response.data
        NotificationManager.success(
          responseData.document.id,
          'Updated blueprint'
        )
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
      <ReactJsonSchemaPlugin
        template={template}
        document={document}
        onSubmit={onSubmit}
      />
    </>
  )
}

export default ReactJsonSchemaWrapper
