// @ts-ignore
// @ts-ignore
import { Link, useLocation } from 'react-router-dom'
import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import { AuthContext } from '../../auth/AuthContext'
import Modal from '../../components/modal/Modal'
import JsonView from '../../components/JsonView'

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
  cursor: pointer;
`

const ModalChildren = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
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
        <ModalChildren>
          <JsonView data={idToken.profile} />
          <button type={'button'} onClick={() => setExpanded(false)}>
            Close
          </button>
        </ModalChildren>
      </Modal>
    </UserInfoBox>
  )
}

export default () => {
  const location = useLocation()
  return (
    <>
      <HeaderWrapper>
        <h4>Data Modelling Tool</h4>
        <UserInfo />
      </HeaderWrapper>
      <Link to={'/'}>
        <TabStyled isSelected={location.pathname === '/'}>Blueprints</TabStyled>
      </Link>
      <Link to={'/entities'}>
        <TabStyled isSelected={location.pathname === '/entities'}>
          Entities
        </TabStyled>
      </Link>
      <Link to={'/search'}>
        <TabStyled isSelected={location.pathname === '/search'}>
          Search
        </TabStyled>
      </Link>
    </>
  )
}
