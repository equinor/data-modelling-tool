import React from 'react'
import { Route } from 'react-router-dom'
import { Layout } from 'antd'

import Routes from './Routes'
import { TApp, TLayout } from './Types'
import Header from './components/App/Header'
import { backgroundColorDefault } from './components/Design/Colors'
import Content from './components/App/Content'
import Menu from './components/App/Menu'

const MainLayout = (props: TLayout) => {
  const { heading, content, settings } = props
  return (
    <>
      <Header appName={settings.label} homeUrl={settings.name} />
      <Layout style={{ background: backgroundColorDefault }}>
        <Menu appRootPath={settings.name} />
        <Content settings={settings} heading={heading} content={content} />
      </Layout>
    </>
  )
}

export default (props: TApp): JSX.Element => {
  const { settings } = props

  return (
    <>
      {Routes.map((route) => (
        <Route
          exact
          path={`/${settings.name}${route.path}`}
          render={() => (
            <MainLayout
              heading={route.heading}
              content={route.content}
              settings={settings}
            />
          )}
          key={route.path}
        />
      ))}
    </>
  )
}
