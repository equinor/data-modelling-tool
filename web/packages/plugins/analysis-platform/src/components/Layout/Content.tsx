import React from 'react'
import { Layout } from 'antd'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'

import { TContent, DocumentPath } from '@development-framework/dm-core'
import { backgroundColorDefault } from '../Design/Colors'

const { Content } = Layout

const PageContent = styled.div`
  padding: 20px;
  background-color: ${backgroundColorDefault};
`

export default (props: TContent): JSX.Element => {
  const { content, settings } = props
  const { data_source, entity_id } = useParams<{
    data_source: string
    entity_id: string
  }>()

  return (
    <Content style={{ margin: '0px 0px 10px 0px' }}>
      {data_source && entity_id && (
        <DocumentPath absoluteDottedId={`${data_source}/${entity_id}`} />
      )}
      {/*@ts-ignore*/}
      <PageContent>{content({ settings: settings })}</PageContent>
    </Content>
  )
}
