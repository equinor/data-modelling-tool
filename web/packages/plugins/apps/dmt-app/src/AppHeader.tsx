// @ts-ignore
import { Link, Route, useLocation } from 'react-router-dom'
import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import {
  AuthContext,
  Button,
  JsonView,
  Modal,
  sortApplications,
} from '@dmt/common'
import ConfigureApplication from './components/ConfigureApplication'
import axios from 'axios'
import { FaQuestion } from 'react-icons/fa'

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
  const { tokenData, logOut } = useContext(AuthContext)
  const [expanded, setExpanded] = useState(false)
  return (
    <div style={{ display: 'flex', alignItems: 'center', columnGap: '5px' }}>
      <UserInfoBox onClick={() => setExpanded(!expanded)}>
        <div>{tokenData?.name || 'Not logged in'}</div>
        <Modal
          toggle={() => setExpanded(!expanded)}
          open={expanded}
          title={'Logged in user info'}
        >
          <JsonView data={tokenData} />
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <Button onClick={() => logOut()}>Log out</Button>
            <Button type={'button'} onClick={() => setExpanded(false)}>
              Close
            </Button>
          </div>
        </Modal>
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
      <Modal
        toggle={() => setExpanded(!expanded)}
        open={expanded}
        title={'About Data Modelling Tool'}
      >
        <b>Last commit: {version}</b>
      </Modal>
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
          <ConfigureApplication />
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
