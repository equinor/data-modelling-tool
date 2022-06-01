import React from 'react'
import { Route } from 'react-router-dom'
import { Layout } from 'antd'

import Routes from './Routes'
import { TApp, TLayout } from './Types'
import { Header } from '@dmt/common'
import { backgroundColorDefault } from './components/Design/Colors'
import Content from './components/Layout/Content'
import Menu from './components/Layout/Menu'

const MainLayout = (props: TLayout) => {
  const { heading, content, settings, allApps } = props
  return (
    <>
      <Header
        appName={settings.label}
        urlPath={settings.urlPath}
        allApps={allApps}
      />
      <Layout style={{ background: backgroundColorDefault }}>
        <Menu appRootPath={settings.urlPath} />
        <Content settings={settings} heading={heading} content={content} />
      </Layout>
    </>
  )
}

export default (props: TApp): JSX.Element => {
  const { settings, applications } = props

  return (
    <>
      {Routes.map((route) => (
        <Route
          exact
          path={`/${settings.urlPath}${route.path}`}
          key={route.path}
          render={() => (
            <MainLayout
              allApps={applications}
              heading={route.heading}
              content={route.content}
              settings={settings}
            />
          )}
        />
      ))}
    </>
  )
}
