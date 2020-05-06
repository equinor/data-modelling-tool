import React from 'react'
// @ts-ignore
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
// @ts-ignore
import DocumentComponent from './common/layout-components/DocumentComponent'

const Group = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(175, 173, 173, 0.71);
  border-radius: 5px;
  padding: 20px 20px;
  background-color: white;
`

export default () => {
  const { data_source, entity_id } = useParams()

  return (
    <>
      <Group>
        <div>
          <b>DataSource:</b>
          <text style={{ marginLeft: '5px' }}>{data_source}</text>
        </div>
        <div>
          <b>Entity:</b>
          <text style={{ marginLeft: '5px' }}>{entity_id}</text>
        </div>
      </Group>
      <DocumentComponent
        dataUrl={`/api/v2/documents/${data_source}/${entity_id}`}
      />
    </>
  )
}
