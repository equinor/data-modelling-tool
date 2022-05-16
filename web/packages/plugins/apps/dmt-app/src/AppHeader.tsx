// @ts-ignore
import { Link, Route, useLocation } from 'react-router-dom'
import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import {
  AuthContext,
  Button,
  JsonView,
  sortApplications,
  Dialog,
  DmssAPI,
} from '@dmt/common'
import axios from 'axios'
import { FaQuestion } from 'react-icons/fa'
// @ts-ignore
import { NotificationManager } from 'react-notifications'

const TabStyled: any = styled.div`
  color: ${(props: any) => (props.isSelected ? 'black' : 'black')};
  padding: 10px 15px;
  display: inline-block;
  margin-bottom: 20px;
  cursor: pointer;
  border-bottom-color: ${(props: any) =>
    props.isSelected ? 'black' : 'white'};
  border-bottom-style: solid;
  border-bottom-width: ${(props: any) => (props.isSelected ? '2px' : '0px')};

  &:hover {
    color: ${(props: any) => (props.isSelected ? 'black' : 'gray')};
  }
`

const HeaderWrapper: any = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`

const QuestionWrapper = styled.div`
  border: black solid 2px;
  font-size: small;
  display: flex;
  justify-content: center;
  border-radius: 50%;
  height: 20px;
  width: 20px;
  align-items: center;

  &:hover {
    background-color: #bbbcbd;
    cursor: pointer;
  }
`

const UserInfoBox = styled.div`
  &:hover {
    color: gray;
  }

  cursor: pointer;
`

function UserInfo() {
  const { tokenData, token, logOut } = useContext(AuthContext)
  const [expanded, setExpanded] = useState(false)
  const [apiKey, setAPIKey] = useState<string | null>(null)
  const dmssApi = new DmssAPI(token)

  return (
    <div style={{ display: 'flex', alignItems: 'center', columnGap: '5px' }}>
      <UserInfoBox>
        <div onClick={() => setExpanded(!expanded)}>
          {tokenData?.name || 'Not logged in'}
        </div>
        <Dialog
          isOpen={expanded}
          closeScrim={() => {
            setExpanded(false)
            setAPIKey(null)
          }}
          header={'Logged in user info'}
          width={'30vw'}
        >
          <JsonView data={tokenData} />
          <div>
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
            {apiKey && <pre>{apiKey}</pre>}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <Button onClick={() => logOut()}>Log out</Button>
          </div>
        </Dialog>
      </UserInfoBox>
    </div>
  )
}

const About = () => {
  const [version, setVersion] = useState<string>('Version not loaded')
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    axios
      .get('version.txt')
      .then((response) => setVersion(response.data))
      .catch(() => null)
  }, [])

  return (
    <div>
      <QuestionWrapper onClick={() => setExpanded(!expanded)}>
        <FaQuestion />
      </QuestionWrapper>
      <Dialog
        isOpen={expanded}
        closeScrim={() => setExpanded(false)}
        header={'About Data Modelling Tool'}
        width={'30vw'}
      >
        <b>Last commit: {version}</b>
      </Dialog>
    </div>
  )
}

interface AppHeaderProps {
  applications: Array<any>
}

export default ({ applications }: AppHeaderProps) => {
  const location = useLocation()

  function getActiveTab() {
    // activeApp (Tab Styling) is based on route, or if route is "/", the first application
    if (location.pathname === '/') return applications[0].name
    else if (location.pathname === '/search') return 'Search'
    return applications.find(
      (app) => app?.name === location.pathname.substring(1)
    )?.name
  }

  return (
    <>
      <HeaderWrapper>
        <Link to="/">
          <h4>Data Modelling Tool</h4>
        </Link>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            columnGap: '15px',
          }}
        >
          <UserInfo />
          <About />
        </div>
      </HeaderWrapper>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <>
            {sortApplications(applications).map((app) => (
              <Link to={`/${app.urlPath}`} key={app.name}>
                <TabStyled isSelected={getActiveTab() === app.name}>
                  {app?.label ? app.label : app.name}
                </TabStyled>
              </Link>
            ))}
          </>
          <Link to={'/DMT/search'}>
            <TabStyled isSelected={location.pathname === '/search'}>
              Search
            </TabStyled>
          </Link>
        </div>
      </div>
    </>
  )
}
