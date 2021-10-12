import { loadPlugins } from '@dmt/core-plugins'
import React, { useEffect, useState } from 'react'
import { createGlobalStyle, ThemeProvider } from 'styled-components'
import {
  BrowserRouter as Router,
  Link,
  Route,
  Redirect,
} from 'react-router-dom'
import { NotificationContainer } from 'react-notifications'
import { Switch } from 'react-router'
import { DmtAPI } from '@dmt/common/src/services/api/DmtAPI'
import config from './config'
import { sortApplications } from '@dmt/common'
import {
  CardWrapper,
  CardHeader,
  CardHeading,
  CardBody,
  CardFieldset,
  CardLink,
} from './components/Card'
import styled from 'styled-components'
import { getPagePlugin } from '@dmt/core-plugins/src/loadPlugins'

export const Config = {
  exportedApp: parseInt(process.env.REACT_APP_EXPORTED_APP) === 1,
}

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
  justify-content: center;

  & > div {
    margin: 20px;
    padding: 20px;
  }
`

const AppSelector = (props) => {
  const { applications } = props
  const links = Object.values(applications).map((setting) => (
    <div>
      <CardWrapper>
        <CardHeader>
          <CardHeading>{`${setting.label}`}</CardHeading>
        </CardHeader>

        <CardBody>
          <CardFieldset>{`${setting.description}`}</CardFieldset>
          <CardFieldset>
            <CardLink>
              <Link to={`/${setting.name}`}>Open</Link>
            </CardLink>
          </CardFieldset>
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
  const [isLoading, setIsLoading] = useState(true)
  const dmtAPI = new DmtAPI()

  useEffect(() => {
    loadPlugins(config).then(() => setIsLoading(false))

    dmtAPI.getSystemSettings().then((res) => {
      setApplications(
        sortApplications(res.data).filter(
          (application) => application?.hidden !== true
        )
      )
    })
  }, [])

  if (isLoading || applications === undefined)
    return <div>Loading application...</div>

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
              <Redirect to={applications[0].name} />
            ) : (
              <AppSelector applications={applications} />
            )
          }
        />
        <Switch>
          {Object.values(applications).map((settings) => (
            <Route
              path={`/${settings.name}`}
              render={() => {
                const ExternalPlugin = getPagePlugin(settings.name)
                return (
                  <ExternalPlugin
                    settings={settings}
                    applications={applications}
                  />
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
