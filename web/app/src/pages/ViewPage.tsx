import React from 'react'
// @ts-ignore
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import DocumentComponent from './editor/layout-components/DocumentComponent'
import DashboardProvider from '../context/dashboard/DashboardProvider'
import { Application, DataSourceAPI }  from '@dmt/common'
// @ts-ignore

const Group = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(175, 173, 173, 0.71);
  border-radius: 5px;
  padding: 20px 20px;
  background-color: white;
`

const dataSourceAPI = new DataSourceAPI()

export default () => {
  const { data_source, entity_id } = useParams()

  return (
    <DashboardProvider
      dataSourceApi={dataSourceAPI}
      application={Application.ENTITIES}
    >
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
    </DashboardProvider>
  )
}
