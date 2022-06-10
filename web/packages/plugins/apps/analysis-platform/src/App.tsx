import React from 'react'
import { Route, Routes as DomRoutes } from 'react-router-dom'
import { Layout } from 'antd'

import Routes from './Routes'
import { Header, TApp, TLayout } from '@dmt/common'
import { backgroundColorDefault } from './components/Design/Colors'
import Content from './components/Layout/Content'
import Menu from './components/Layout/Menu'

const MainLayout = (props: TLayout) => {
  const { content, settings, allApps } = props
  return (
    <>
      <Header
        appName={settings.label}
        urlPath={settings.urlPath}
        allApps={allApps}
      />
      <Layout style={{ background: backgroundColorDefault }}>
        <Menu appRootPath={settings.urlPath} />
        <Content settings={settings} content={content} />
      </Layout>
    </>
  )
}

export default (props: TApp): JSX.Element => {
  const { settings, applications } = props

  return (
    <DomRoutes>
      {Routes.map((route) => {
        return (
          <Route
            key={route.path}
            path={`${route.path}/*`}
            element={
              <MainLayout
                allApps={applications}
                content={route.content}
                settings={settings}
              />
            }
          />
        )
      })}
    </DomRoutes>
  )
}
