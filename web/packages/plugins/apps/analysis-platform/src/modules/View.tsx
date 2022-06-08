import React from 'react'
import { useParams } from 'react-router-dom'
import { useDocument, UIPluginSelector } from '@dmt/common'
// @ts-ignore
import { NotificationManager } from 'react-notifications'
import { TValidEntity } from '@dmt/common'
import { ErrorGroup } from '../components/ErrorGroup'

export const View = ({ settings }: any) => {
  const { data_source, entity_id } = useParams<{
    data_source: string
    entity_id: string
  }>()
  const [
    document,
    documentLoading,
    setDocument,
    error,
  ] = useDocument<TValidEntity>(data_source, entity_id, false)

  if (error)
    return (
      <ErrorGroup>
        <b>Error</b>
        <b>
          Failed to fetch document
          <code>
            {data_source}/{entity_id}
          </code>
        </b>
      </ErrorGroup>
    )

  return (
    <>
      {document && (
        <UIPluginSelector
          absoluteDottedId={`${data_source}/${entity_id}`}
          entity={document}
          breadcrumb={true}
          onSubmit={(formData: any) => {
            setDocument(formData)
          }}
        />
      )}
    </>
  )
}
