import React from 'react'
// @ts-ignore
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import {
  ApplicationContext,
  TValidEntity,
  UIPluginSelector,
  useDocument,
} from '@dmt/common'
// @ts-ignore
import { NotificationManager } from 'react-notifications'
import { SimplifiedTree } from '../components/SimplifiedTree'
import { ErrorGroup } from '../components/Wrappers'

const Group = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(175, 173, 173, 0.71);
  border-radius: 5px;
  padding: 20px 20px;
  background-color: white;
`

export default ({ settings }: any) => {
  const { data_source, entity_id } = useParams<{
    data_source: string
    entity_id: string
  }>()
  const [
    document,
    documentLoading,
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
      <ApplicationContext.Provider
        value={{ ...settings, displayAllDataSources: true }}
      >
        <Group>
          <div>
            <SimplifiedTree document={document} datasourceId={data_source} />
          </div>
          <div>
            <b>DataSource:</b>
            <p style={{ marginLeft: '5px' }}>{data_source}</p>
          </div>
          <div>
            <b>Entity:</b>
            <p style={{ marginLeft: '5px' }}>{entity_id}</p>
          </div>
          {document && (
            <UIPluginSelector
              absoluteDottedId={`${data_source}/${entity_id}`}
              entity={document}
            />
          )}
        </Group>
      </ApplicationContext.Provider>
    </>
  )
}
