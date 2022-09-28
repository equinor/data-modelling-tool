import React, { useContext, useEffect, useState } from 'react'
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components'
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  useHistory,
} from 'react-router-dom'
import { NotificationContainer } from 'react-notifications'
import { Switch } from 'react-router'
import { Progress } from '@equinor/eds-core-react'
import { DmtAPI } from '@development-framework/dm-core'
import {
  AuthContext,
  sortApplications,
  UiPluginContext,
  ApplicationContext,
  FSTreeProvider,
} from '@development-framework/dm-core'
import {
  CardBody,
  CardFieldset,
  CardHeader,
  CardHeading,
  CardWrapper,
} from './components/Card'

const GlobalStyle = createGlobalStyle`
  body {
    padding: 0;
    margin: 0;
    font-family: Equinor-Regular, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`

const theme = {
  flexboxgrid: {
    gutterWidth: 0, // rem
    outerMargin: 0, // rem
  },
}

const HorizontalList = styled.div`
  display: flex;
  flex-flow: wrap;
  justify-content: center;

  & > div {
    margin: 20px;
    padding: 20px;
  }
`

const AppSelector = (props) => {
  const { applications } = props
  const history = useHistory()
  const links = Object.values(applications).map((setting) => (
    <div key={setting.name}>
      <CardWrapper onClick={() => history.push(`/${setting.urlPath}`)}>
        <CardHeader>
          <CardHeading>{`${setting.label}`}</CardHeading>
        </CardHeader>
        <CardBody>
          <CardFieldset>{`${setting.description}`}</CardFieldset>
        </CardBody>
      </CardWrapper>
    </div>
  ))
  return (
    <div>
      <HorizontalList>{links}</HorizontalList>
    </div>
  )
}

function App() {
  const [applications, setApplications] = useState(undefined)
  const [loadingAppSettings, setLoadingAppSettings] = useState(false)
  const { loading, getPagePlugin } = useContext(UiPluginContext)
  const { token, loginInProgress } = useContext(AuthContext)
  const authEnabled = process.env.REACT_APP_AUTH === '1'

  useEffect(() => {
    const dmtAPI = new DmtAPI('')
    setLoadingAppSettings(true)
    dmtAPI
      .getAppSettings()
      .then((res) =>
        setApplications(
          sortApplications(res.data).filter(
            (application) => application?.hidden !== true
          )
        )
      )
      .catch((error) => console.error(error))
      .finally(() => setLoadingAppSettings(false))
  }, [])

  // Stops web-page from flickering while the user is being logged in
  // if (authEnabled && loginInProgress) return null

  if (authEnabled && !token) {
    return <div>You are not logged in. Reload page to login</div>
  }

  if (loading || loadingAppSettings)
    return (
      <Progress.Circular
        style={{
          display: 'block',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: '150px',
        }}
      />
    )
  if (!applications) {
    return <>Error: Failed to fetch Application settings</>
  }
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <GlobalStyle />
        <NotificationContainer />
        <Route
          exact
          path="/"
          render={() =>
            applications.length === 1 ? (
              <Redirect to={applications[0].urlPath} />
            ) : (
              <AppSelector applications={applications} />
            )
          }
        />
        <Switch>
          {Object.values(applications).map((settings) => (
            <Route
              path={`/${settings.urlPath}`}
              render={() => {
                const UiPlugin = getPagePlugin(settings?.pluginName || '')
                  .component
                if (!UiPlugin)
                  return (
                    <div style={{ color: 'red' }}>
                      {' '}
                      <b>Error:</b>Failed to get UiPlugins, see web console for
                      details.
                    </div>
                  )
                return (
                  <ApplicationContext.Provider value={settings}>
                    <FSTreeProvider>
                      <UiPlugin
                        settings={settings}
                        applications={applications}
                      />
                    </FSTreeProvider>
                  </ApplicationContext.Provider>
                )
              }}
              key={settings.name}
            />
          ))}
        </Switch>
      </Router>
    </ThemeProvider>
  )
}

export default App
