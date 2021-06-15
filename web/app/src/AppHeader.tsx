// @ts-ignore
import { Link, Route, useLocation } from 'react-router-dom'
import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import { AuthContext } from './context/auth/AuthContext'
import { JsonView, Modal } from '@dmt/common'
import ConfigureApplication from './components/ConfigureApplication'
import { sortApplications } from './utils/applicationHelperFunctions'

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

const UserInfoBox = styled.div`
  &:hover {
    color: gray;
  }

  cursor: pointer;
`

function UserInfo() {
  const idToken: any = useContext(AuthContext)
  const [expanded, setExpanded] = useState(false)
  return (
    <UserInfoBox onClick={() => setExpanded(!expanded)}>
      <div>{idToken.profile.name}</div>
      <Modal
        toggle={() => setExpanded(!expanded)}
        open={expanded}
        title={'Logged in user info'}
      >
        <JsonView data={idToken.profile} />
        <button type={'button'} onClick={() => setExpanded(false)}>
          Close
        </button>
      </Modal>
    </UserInfoBox>
  )
}
interface AppHeaderProps {
  applications: Array<any>
}

export default ({ applications }: AppHeaderProps) => {
  const location = useLocation()

  function getActiveTab() {
    // activeApp (Tab Styling) is based on route, or if route is "/", the first application
    if (location.pathname === '/') return Object.keys(applications)[0]
    return Object.keys(applications).find(
      (key: string) => key === location.pathname.substring(1)
    )
  }

  //take ekstra props to appheader?

  return (
    <>
      <HeaderWrapper>
        <h4>Data Modelling Tool</h4>
        <UserInfo />
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
            {sortApplications().map((app) => {
              if (!app.hidden) {  //todo ?.hidden here instead????????????????????
                return (
                  <Link to={`/${app.name}`} key={app.name}>
                    <TabStyled isSelected={activeApp === app.name}>
                      {app?.label}
                    </TabStyled>
                  </Link>
                )
              }
            })}
          </>
          <Link to={'/search'}>
            <TabStyled isSelected={location.pathname === '/search'}>
              Search
            </TabStyled>
          </Link>
        </div>
        <ConfigureApplication />
      </div>
    </>
  )
}
