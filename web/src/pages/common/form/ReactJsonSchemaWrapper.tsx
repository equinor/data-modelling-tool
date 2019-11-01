import React from 'react'
import axios from 'axios'
//@ts-ignore
import { NotificationManager } from 'react-notifications'
import FetchDocument from '../utils/FetchDocument'
import { LayoutContext } from '../golden-layout/LayoutContext'
import { DefaultView } from '../../../plugins/view/ViewPlugin'
import { DefaultEditForm } from '../../../plugins'

interface Props {
  dataUrl: string
  schemaUrl: string
  document: any
  attribute: string
  uiRecipe: string
}

export const onFormSubmit = ({ attribute, dataUrl, layout }: any) => {
  return (schemas: any) => {
    const url = attribute ? `${dataUrl}/${attribute}` : dataUrl
    axios
      .put(url, schemas.formData)
      .then((response: any) => {
        const responseData: any = response.data
        NotificationManager.success(responseData.data.uid, 'Updated blueprint')
        try {
          layout.refresh(responseData.data.uid)
        } catch (e) {
          console.error('failed to refresh tab.')
        }
      })
      .catch((e: any) => {
        NotificationManager.error(
          'Failed to update blueprint',
          'Updated blueprint'
        )
      })
  }
}

const ReactJsonSchemaWrapper = (props: Props) => {
  const { document, schemaUrl, dataUrl, attribute, uiRecipe } = props

  return (
    <LayoutContext.Consumer>
      {(layout: any) => {
        console.log(layout)
        return (
          <FetchDocument
            url={`${schemaUrl}?ui_recipe=${uiRecipe}`}
            render={(data: any) => {
              return (
                <DefaultEditForm
                  document={document}
                  template={data}
                  onSubmit={onFormSubmit({ attribute, dataUrl, layout })}
                />
              )
            }}
          />
        )
      }}
    </LayoutContext.Consumer>
  )
}

export default ReactJsonSchemaWrapper
