import React from 'react'
import { useParams } from 'react-router-dom'
import {
  useDocument,
  UIPluginSelector,
  TValidEntity,
} from '@development-framework/dm-core'

import { ErrorGroup } from '../components/ErrorGroup'

export const View = () => {
  const { data_source, entity_id } = useParams<{
    data_source: string
    entity_id: string
  }>()
  const [
    document,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    documentLoading,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setDocument,
    error,
  ] = useDocument<TValidEntity>(data_source, entity_id)

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
          type={document.type}
        />
      )}
    </>
  )
}
