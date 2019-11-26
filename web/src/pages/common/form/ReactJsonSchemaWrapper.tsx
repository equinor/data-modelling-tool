import React from 'react'
import axios from 'axios'
//@ts-ignore
import { NotificationManager } from 'react-notifications'
import FetchDocument from '../utils/FetchDocument'
import { LayoutContext } from '../golden-layout/LayoutContext'
import { DefaultEditForm } from '../../../plugins'
import { Blueprint } from '../../../plugins/types'

interface Props {
  dataUrl: string
  schemaUrl: string
  document: any
  attribute: string
  uiRecipe: string
  blueprint: Blueprint
  blueprints: Blueprint[]
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
          layout.refresh(responseData.uid)
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
  const {
    document,
    schemaUrl,
    dataUrl,
    attribute,
    uiRecipe,
    blueprints,
    blueprint,
  } = props

  return (
    <LayoutContext.Consumer>
      {(layout: any) => {
        return (
          <FetchDocument
            url={`${schemaUrl}?ui_recipe=${uiRecipe}`}
            render={(data: any) => {
              return (
                <DefaultEditForm
                  blueprint={blueprint}
                  blueprints={blueprints}
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
