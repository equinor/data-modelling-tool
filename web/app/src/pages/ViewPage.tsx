import React from 'react'
// @ts-ignore
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import DocumentComponent from './editor/layout-components/DocumentComponent'
import DashboardProvider, {
  IDashboard,
  useDashboard,
} from '../context/dashboard/DashboardProvider'
import { Application, DataSourceAPI, IndexAPI } from '@dmt/common'
import IndexProvider from '../context/global-index/IndexProvider'
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

const IndexContextWrapper = () => {
  const dashboard: IDashboard = useDashboard()
  const { data_source, entity_id } = useParams()
  const indexAPI = new IndexAPI()
  return (
    <IndexProvider
      indexApi={indexAPI}
      dataSources={dashboard.models.dataSources.models.dataSources}
      application={dashboard.models.application}
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
      <DocumentComponent dataSourceId={data_source} documentId={entity_id} />
    </IndexProvider>
  )
}

export default () => {
  return (
    <DashboardProvider
      dataSourceApi={dataSourceAPI}
      application={Application.ENTITIES}
    >
      <IndexContextWrapper />
    </DashboardProvider>
  )
}
