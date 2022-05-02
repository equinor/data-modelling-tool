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
import { DmtAPI } from '@dmt/common/src/services/api/DmtAPI'
import {
  sortApplications,
  UiPluginContext,
  ApplicationContext,
} from '@dmt/common'
import {
  CardBody,
  CardFieldset,
  CardHeader,
  CardHeading,
  CardWrapper,
} from './components/Card'
import { AuthContext } from 'react-oauth2-code-pkce'

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
  const { token } = useContext(AuthContext)
  const authEnabled = process.env.REACT_APP_AUTH === '1'
  const dmtAPI = new DmtAPI()

  useEffect(() => {
    setLoadingAppSettings(true)
    dmtAPI
      .getSystemSettings()
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

  if (authEnabled && !token) {
    // Avoid rendering loading icons if the user is about to be redirected to a login endpoint
    return null
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
                    <UiPlugin settings={settings} applications={applications} />
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
