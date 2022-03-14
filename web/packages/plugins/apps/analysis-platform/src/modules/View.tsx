import React from 'react'
// @ts-ignore
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { useDocument, UIPluginSelector } from '@dmt/common'
// @ts-ignore
import { NotificationManager } from 'react-notifications'

export const ErrorGroup = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(213, 18, 18, 0.71);
  border-radius: 5px;
  padding: 20px 20px;
  background-color: #f6dfdf;
`

export const View = ({ settings }: any) => {
  const { data_source, entity_id } = useParams()
  const [document, documentLoading, setDocument, error] = useDocument(
    data_source,
    entity_id
  )

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
          categories={['view']}
          breadcrumb={true}
        />
      )}
    </>
  )
}
