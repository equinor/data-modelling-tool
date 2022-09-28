import React, { useContext, useEffect, useState } from 'react'
import { Icon, Radio, TopBar } from '@equinor/eds-core-react'
import { grid_on, info_circle, account_circle } from '@equinor/eds-icons'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import { APP_ROLES, DMSS_ADMIN_ROLE } from '../utils/appRoles'
// @ts-ignore
import { NotificationManager } from 'react-notifications'
import axios, { AxiosResponse } from 'axios'
import { TDmtSettings } from '../types'
import { AuthContext } from 'react-oauth2-code-pkce'
import { DmssAPI } from '../services'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { sortApplications } from '../utils/applicationHelperFunctions'
import { Dialog } from './Dialog'
import { Button } from './Button'

Icon.add({
  grid_on,
  info_circle,
  account_circle,
})

const Icons = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row-reverse;

  > * {
    margin-left: 40px;
  }
`

const AppSelectorWrapper = styled.div`
  position: absolute;
  top: 60px;
  left: 0;
  min-width: 300px;
  max-width: 300px;
  background: #ffffff;
  border: 1px solid gray;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  padding: 10px;
  width: min-content;
`

const AppBox = styled.div`
  border: 3px solid grey;
  padding: 8px;
  margin: 5px;
  height: 80px;
  width: 80px;
  background: #b3dae0;
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background: #4f878d;
  }
`
export const ClickableIcon = styled.div`
  &:hover {
    color: gray;
    cursor: pointer;
  }
`

const UnstyledList = styled.ul`
  margin: 0;
  padding: 0;
  list-style-type: none;
  display: inline-flex;
`

const StyledLink = styled(Link)`
  text-decoration: none;
  color: black;

  &:focus,
  &:hover {
    text-decoration: none;
    color: black;
  }

  &:visited,
  &:link,
  &:active {
    text-decoration: none;
  }
`

export const Header = (props: {
  appName: string
  urlPath: string
  allApps: TDmtSettings[]
}): JSX.Element => {
  const { appName, urlPath, allApps } = props
  const [version, setVersion] = useState<string>('Version not loaded')
  const { tokenData, token, logOut } = useContext(AuthContext)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [visibleUserInfo, setVisibleUserInfo] = useState<boolean>(false)
  const [appSelectorOpen, setAppSelectorOpen] = useState<boolean>(false)
  const [apiKey, setAPIKey] = useState<string | null>(null)
  const dmssApi = new DmssAPI(token)
  const [checked, updateChecked] = useLocalStorage<string | null>(
    'impersonateRoles',
    null
  )

  useEffect(() => {
    axios
      .get('/version.txt')
      .then((response: AxiosResponse<string>) => setVersion(response.data))
      .catch(() => null)
  }, [])

  return (
    <TopBar>
      <TopBar.Header>
        <ClickableIcon onClick={() => setAppSelectorOpen(!appSelectorOpen)}>
          <Icon name="grid_on" size={32} />
        </ClickableIcon>
        <StyledLink
          style={{ display: 'flex' }}
          to={{
            pathname: `/${urlPath}`,
          }}
        >
          <h4 style={{ paddingTop: 9, paddingLeft: 10 }}>{appName}</h4>
        </StyledLink>
        {appSelectorOpen && (
          <AppSelectorWrapper>
            {sortApplications(allApps).map((app) => (
              <Link to={`/${app.urlPath}`} key={app.name}>
                <AppBox>{app?.label ? app.label : app.name}</AppBox>
              </Link>
            ))}
            <Link to={'/DMT/search'}>
              <AppBox>Search</AppBox>
            </Link>
          </AppSelectorWrapper>
        )}
      </TopBar.Header>
      <TopBar.Actions>
        <Icons>
          <ClickableIcon onClick={() => setAboutOpen(true)}>
            <Icon name="info_circle" size={24} title="About" />
          </ClickableIcon>
          <ClickableIcon onClick={() => setVisibleUserInfo(true)}>
            <Icon name="account_circle" size={24} title="User" />
          </ClickableIcon>
        </Icons>
      </TopBar.Actions>
      <Dialog
        isOpen={aboutOpen}
        closeScrim={() => setAboutOpen(false)}
        header={'About Data Modelling Tool'}
        width={'40vw'}
      >
        <b>Last commit: {version}</b>
      </Dialog>
      <Dialog
        isOpen={visibleUserInfo}
        header={'User info'}
        closeScrim={() => setVisibleUserInfo(false)}
        width={'720px'}
      >
        <div style={{ margin: '20px' }}>
          <pre style={{ whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(
              {
                name: tokenData?.name,
                preferred_username: tokenData?.preferred_username,
                roles: tokenData?.roles,
                scope: tokenData?.scp,
                token_issuer: tokenData?.iss,
              } || '',
              null,
              2
            )}
          </pre>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(token)
                NotificationManager.success('Copied token to clipboard')
              }}
            >
              Copy token to clipboard
            </Button>
            <Button
              onClick={() =>
                dmssApi
                  .tokenCreate()
                  .then((response: any) => setAPIKey(response.data))
                  .catch((error: any) => {
                    console.error(error)
                    NotificationManager.error(
                      'Failed to create personal access token'
                    )
                  })
              }
            >
              Create API-Key
            </Button>
            <Button onClick={() => logOut()}>Log out</Button>
          </div>
          {apiKey && <pre>{apiKey}</pre>}

          {tokenData?.roles.includes(DMSS_ADMIN_ROLE) && (
            <>
              <p>Impersonate a role (UI only)</p>
              <UnstyledList>
                {APP_ROLES.map((role: string) => (
                  <li key={role}>
                    <Radio
                      label={role}
                      name="impersonate-role"
                      value={role}
                      checked={checked === role}
                      onChange={(e: any) => updateChecked(e.target.value)}
                    />
                  </li>
                ))}
              </UnstyledList>
            </>
          )}
        </div>
      </Dialog>
    </TopBar>
  )
}
