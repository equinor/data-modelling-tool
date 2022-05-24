import React, { useContext, useState } from 'react'
import { Radio, TopBar } from '@equinor/eds-core-react'
import styled from 'styled-components'
import Icon from '../Design/Icons'
import { Link } from 'react-router-dom'
import { AuthContext, Dialog, useLocalStorage } from '@dmt/common'

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

export default (props: { appName: string }): JSX.Element => {
  const { appName } = props
  const [visibleUserInfo, setVisibleUserInfo] = useState<boolean>(false)
  const { tokenData } = useContext(AuthContext)
  const [checked, updateChecked] = useLocalStorage<string | null>(
    'impersonateRoles',
    null
  )

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
      <Dialog
        isOpen={visibleUserInfo}
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
        {tokenData?.roles.includes('dmss-admin') && (
          <>
            <p>Impersonate a role (UI only)</p>
            <UnstyledList>
              {[
                'dmss-admin',
                'operator',
                'expert-operator',
                'domain-expert',
                'domain-developer',
              ].map((role: string) => (
                <li key={role}>
                  <Radio
                    label={role}
                    name="impersonate-role"
                    value={role}
                    checked={checked === role}
                    //@ts-ignore
                    onChange={(e: any) => updateChecked(e.target.value)}
                  />
                </li>
              ))}
            </UnstyledList>
          </>
        )}
      </Dialog>
    </TopBar>
  )
}
