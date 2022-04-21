import React, { useContext, useState } from 'react'
import { TopBar } from '@equinor/eds-core-react'
import styled from 'styled-components'
import Icon from '../Design/Icons'
import { Link } from 'react-router-dom'
import { AuthContext, CustomScrim } from '@dmt/common'

const Icons = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  > * {
    margin-left: 40px;
  }
`

export const ClickableIcon = styled.div`
  &:hover {
    color: gray;
    cursor: pointer;
  }
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

export default (props: { appName: string; homeUrl: string }): JSX.Element => {
  const { appName, homeUrl } = props
  const [visibleUserInfo, setVisibleUserInfo] = useState<boolean>(false)
  const { tokenData } = useContext(AuthContext)
  return (
    <TopBar>
      <TopBar.Header>
        <StyledLink
          style={{ display: 'flex' }}
          to={{
            pathname: `/`,
          }}
        >
          <Icon name="waves" size={32} />
          <h4 style={{ paddingTop: 9, paddingLeft: 10 }}>{appName}</h4>
        </StyledLink>
      </TopBar.Header>
      <TopBar.Actions>
        <Icons>
          <ClickableIcon onClick={() => setVisibleUserInfo(true)}>
            <Icon name="account_circle" size={24} title="User" />
          </ClickableIcon>
        </Icons>
      </TopBar.Actions>
      {visibleUserInfo && (
        <CustomScrim
          header={'User info'}
          closeScrim={() => setVisibleUserInfo(false)}
        >
          <pre style={{ whiteSpace: 'pre-line' }}>
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
        </CustomScrim>
      )}
    </TopBar>
  )
}
