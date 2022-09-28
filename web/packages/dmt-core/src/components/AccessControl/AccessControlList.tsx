import React, { useContext, useEffect, useState } from 'react'
import { Button, Checkbox, Icon, Progress, Tabs } from '@equinor/eds-core-react'
import styled from 'styled-components'
import { edit_text, save } from '@equinor/eds-icons'

import DmssAPI from '../../services/api/DmssAPI'
import { useLocalStorage } from '../../hooks/useLocalStorage'
//@ts-ignore
import { NotificationManager } from 'react-notifications'
import {
  getTokenWithUserReadAccess,
  getUsernameMappingFromUserId,
  getUsernameMappingFromUsername,
} from '../../utils/UsernameConversion'
import { AxiosError, AxiosResponse } from 'axios'
import { ACLUserRolesPanel } from './ACLUserRolesPanel'
import { ACLOwnerPanel } from './ACLOwnerPanel'
import { TUserIdMapping } from '../../types'
import { AccessLevel, ACL } from '../../services'
import { AuthContext } from 'react-oauth2-code-pkce'

Icon.add({ edit_text, save })

const ACLWrapper = styled.div`
  max-width: 650px;
  padding: 10px;
`

type CenteredRowType = {
  width?: string
  even?: boolean
  justifyContent?: string
}

export const CenteredRow = styled.div<CenteredRowType>`
  display: flex;
  flex-flow: row;
  align-items: center;
  padding-bottom: 10px;
  justify-content: ${(props: CenteredRowType) =>
    props.justifyContent || 'space-between'};
  width: ${(props: CenteredRowType) => props.width || 'inherit'};
  background-color: ${(props: CenteredRowType) => {
    if (props.even) return '#F7F7F7'
    return 'inherit'
  }};
`

export const AccessControlList = (props: {
  documentId: string
  dataSourceId: string
}): JSX.Element => {
  const { documentId, dataSourceId } = props

  const [activeTab, setActiveTab] = useState<number>(0)
  const [storeACLRecursively, setStoreACLRecursively] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingACLDocument, setLoadingACLDocument] = useState<boolean>(false)
  const [tokenWithReadAccess, setTokenWithReadAccess] = useState<string>('')
  const { token } = useContext(AuthContext)
  const [refreshToken] = useLocalStorage('ROCP_refreshToken', '')
  const dmssAPI = new DmssAPI(token)

  const [documentACL, setDocumentACL] = useState<ACL>({
    owner: '',
    roles: {},
    users: {},
    others: AccessLevel.READ,
  })

  const convertACLFromUserIdToUsername = async (acl: ACL): Promise<ACL> => {
    const aclCopy: ACL = JSON.parse(JSON.stringify(acl)) //deep copy the acl object

    const newUsers: { [key: string]: AccessLevel } = {}
    const users = aclCopy.users
    if (!users) {
      NotificationManager.error('No users in ACL object!')
      return Promise.reject()
    } else {
      return Promise.all(
        Object.keys(users).map((usernameId: string) => {
          return getUsernameMappingFromUserId(usernameId, tokenWithReadAccess)
        })
      )
        .then((userIdMappings: TUserIdMapping[]) => {
          userIdMappings.map((userIdMapping: TUserIdMapping) => {
            newUsers[userIdMapping.username] = users[userIdMapping.userId]
          })
          aclCopy.users = newUsers
        })
        .then(() => {
          return getUsernameMappingFromUserId(
            aclCopy.owner,
            tokenWithReadAccess
          ).then((userIdMapping: TUserIdMapping) => {
            if (userIdMapping.username) {
              aclCopy.owner = userIdMapping.username
            } else {
              aclCopy.owner = userIdMapping.userId
            }

            return aclCopy
          })
        })
    }
  }

  const convertACLFromUsernameToUserId = (acl: ACL): Promise<ACL> => {
    const aclCopy: ACL = JSON.parse(JSON.stringify(acl)) //deep copy the acl object

    const newUsers: { [key: string]: AccessLevel } = {}
    const users = acl.users
    if (!users) {
      NotificationManager.error('No users in ACL object!')
      return Promise.reject()
    } else {
      return Promise.all(
        Object.keys(users).map((username: string) => {
          return getUsernameMappingFromUsername(username, tokenWithReadAccess)
        })
      ).then((userIdMappings: TUserIdMapping[]) => {
        userIdMappings.map((userIdMapping: TUserIdMapping) => {
          newUsers[userIdMapping.userId] = users[userIdMapping.username]
        })
        aclCopy.users = newUsers
        return getUsernameMappingFromUsername(
          aclCopy.owner,
          tokenWithReadAccess
        ).then((userIdMapping: TUserIdMapping) => {
          if (userIdMapping.userId) {
            aclCopy.owner = userIdMapping.userId
          } else {
            aclCopy.owner = userIdMapping.username
          }
          return aclCopy
        })
      })
    }
  }

  useEffect(() => {
    if (tokenWithReadAccess !== '') {
      setLoadingACLDocument(true)
      dmssAPI
        .getAcl({
          dataSourceId: dataSourceId,
          documentId: documentId,
        })
        .then((response: AxiosResponse<ACL>) => {
          const acl = response.data
          convertACLFromUserIdToUsername(acl)
            .then((newACL: ACL) => {
              setDocumentACL(newACL)
            })
            .catch((error) => {
              NotificationManager.error(
                `Could not convert username ID to username (${error})`
              )
            })
            .finally(() => {
              setLoadingACLDocument(false)
            })
        })
        .catch((error: AxiosError<any>) => {
          if (error.response) {
            NotificationManager.error(
              `Could not fetch ACL for this document (${
                error.response.data || error.message
              })`
            )
          } else {
            console.error(error)
          }
        })
    }
  }, [tokenWithReadAccess])

  useEffect(() => {
    if (typeof refreshToken === 'string') {
      getTokenWithUserReadAccess(refreshToken).then((token: string) => {
        setTokenWithReadAccess(token)
      })
    } else {
      throw new Error('Refresh token not found')
    }
  }, [documentId])

  async function saveACL(acl: ACL) {
    setLoading(true)
    convertACLFromUsernameToUserId(acl)
      .then((newACL) => {
        dmssAPI
          .setAcl({
            dataSourceId: dataSourceId,
            documentId: documentId,
            aCL: newACL,
            recursively: storeACLRecursively,
          })
          .then(() => {
            NotificationManager.success('ACL saved!')
          })
      })
      .catch((error) => {
        NotificationManager.error(`Could not save ACL (${error})`)
      })
      .finally(() => setLoading(false))
  }

  function handleChange(value: Partial<ACL>) {
    setDocumentACL({ ...documentACL, ...value })
  }

  if (
    loadingACLDocument ||
    documentACL.users === undefined ||
    documentACL.roles === undefined
  )
    return (
      <Progress.Circular
        style={{
          display: 'block',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: '10px',
        }}
      />
    )

  return (
    <ACLWrapper>
      <Tabs
        activeTab={activeTab}
        onChange={(index: number) => setActiveTab(index)}
        variant="fullWidth"
      >
        <Tabs.List>
          <Tabs.Tab>Owner</Tabs.Tab>
          <Tabs.Tab>Roles</Tabs.Tab>
          <Tabs.Tab>Users</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panels>
          <Tabs.Panel>
            <ACLOwnerPanel acl={documentACL} handleChange={handleChange} />
          </Tabs.Panel>
          <Tabs.Panel>
            <ACLUserRolesPanel
              aclKey="roles"
              entities={documentACL.roles}
              handleChange={handleChange}
            />
          </Tabs.Panel>
          <Tabs.Panel>
            <ACLUserRolesPanel
              aclKey="users"
              entities={documentACL.users}
              handleChange={handleChange}
            />
          </Tabs.Panel>
        </Tabs.Panels>
      </Tabs>

      <CenteredRow>
        <Button onClick={() => saveACL(documentACL)}>
          {(loading && <Progress.Dots color="neutral" />) || 'Save'}
          {!loading && <Icon name="save" title="save" size={24} />}
        </Button>
        <Checkbox
          checked={storeACLRecursively}
          label="Change access recursively"
          onClick={() => setStoreACLRecursively(!storeACLRecursively)}
        ></Checkbox>
      </CenteredRow>
    </ACLWrapper>
  )
}

export default AccessControlList
