import React, { useContext, useEffect, useState } from 'react'
import {
  Button,
  Input,
  Tabs,
  Icon,
  Checkbox,
  Progress,
} from '@equinor/eds-core-react'
import styled from 'styled-components'
import { edit_text, save } from '@equinor/eds-icons'
import { AuthContext } from '@dmt/common'
import DmssAPI from '../services/api/DmssAPI'
import { useLocalStorage } from '../hooks/useLocalStorage'
//@ts-ignore
import { NotificationManager } from 'react-notifications'
import {
  getUsernameMappingFromId,
  getUsernameMappingFromUsername,
  UsernameIdMapping,
} from '../utils/UsernameConversion'

Icon.add({ edit_text, save })

export enum ACLEnum {
  READ = 'READ',
  WRITE = 'WRITE',
  NONE = 'NONE',
}

export type TAcl = {
  owner: string
  roles: { [key: string]: ACLEnum }
  users: { [key: string]: ACLEnum }
  others: ACLEnum
}

export type TokenResponse = {
  token_type: string
  scope: string
  expires_in: number
  ext_expires_in: number
  access_token: string
  refresh_token: string
}

const ACLWrapper = styled.div`
  max-width: 650px;
  padding: 10px;
`

const TableWrapper = styled.div`
  border: black 1px solid;
  border-radius: 3px;
  max-height: 200px;
  overflow: auto;
  margin-bottom: 10px;
`

const ListRow = styled.div`
  display: flex;
  flex-flow: row;
  align-items: center;
  padding: 5px;
  justify-content: space-around;
  background-color: ${(props: any) => {
    if (props.even) return '#F7F7F7'
    return 'inherit'
  }};
`

type CenteredRowType = {
  width?: any
  even?: any
  justifyContent?: any
}

const CenteredRow = styled.div<CenteredRowType>`
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
type GridContainerType = {
  even?: any
}

const GridContainer = styled.div<GridContainerType>`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-items: center;
  align-items: center;
  background-color: ${(props: GridContainerType) => {
    if (props.even) return '#F7F7F7'
    return 'inherit'
  }};
`

const StyledOption = styled.option`
  font-weight: 700;
`
const StyledSelect = styled.select`
  font-weight: 700;
  width: 80px;
  padding: 3px;
  border-radius: 3px;
  background-color: transparent;
`

const ACLSelect = ({ value, handleChange }: any): JSX.Element => {
  return (
    <div style={{ width: '150px', padding: '10px' }}>
      <StyledSelect
        value={value}
        onChange={(event) => handleChange(event.target.value)}
      >
        {Object.values(ACLEnum).map((accessLevel) => (
          <StyledOption value={accessLevel} key={accessLevel}>
            {accessLevel}
          </StyledOption>
        ))}
      </StyledSelect>
    </div>
  )
}

interface ACLOwnerPanelProps {
  acl: TAcl
  handleChange: Function
}

const ACLOwnerPanel = ({
  acl,
  handleChange,
}: ACLOwnerPanelProps): JSX.Element => {
  return (
    <>
      <CenteredRow width={'230px'}>
        Owner:
        <Input
          style={{ width: '150px', marginLeft: '5px' }}
          placeholder={acl.owner}
          onChange={(event): Event =>
            handleChange({ owner: event.target.value })
          }
        />
        <Icon name="edit_text" size={24} style={{ color: 'teal' }} />
      </CenteredRow>
      <CenteredRow width={'160px'}>
        Others:
        <ACLSelect
          value={acl.others}
          handleChange={(newValue: string) =>
            handleChange({ others: newValue })
          }
        />
      </CenteredRow>
    </>
  )
}

interface URPanelProps {
  entities: { [key: string]: ACLEnum }
  handleChange: Function
  aclKey: string
}

const ACLUserRolesPanel = ({
  entities,
  handleChange,
  aclKey,
}: URPanelProps): JSX.Element => {
  const [newRole, setNewRole] = useState<string>('')
  const getPlaceholderText = () => {
    if (aclKey === 'users') {
      return 'Add new user'
    } else if (aclKey === 'roles') {
      return 'Add new role'
    } else {
      new Error(`aclKey ${aclKey} is invalid`)
    }
  }
  return (
    <>
      {aclKey === 'users' && (
        <p style={{ fontStyle: 'italic' }}>Use equinor short name</p>
      )}
      <CenteredRow>
        <Input
          style={{ width: '170px' }}
          placeholder={getPlaceholderText()}
          onChange={(e) => setNewRole(e.target.value)}
        />
        <Button
          onClick={() =>
            handleChange({
              [aclKey]: { ...entities, [newRole]: ACLEnum.NONE },
            })
          }
          disabled={!newRole}
        >
          Add +
        </Button>
      </CenteredRow>
      <ListRow>
        <div>{aclKey[0].toUpperCase() + aclKey.substring(1)}</div>
        <div>Access Level</div>
        <div></div>
      </ListRow>
      <TableWrapper>
        {Object.entries(entities).map(([entity, access], index): any => {
          const roleHandleChange = (value: ACLEnum) => {
            entities[entity] = value
            handleChange({ [aclKey]: entities })
          }
          return (
            <GridContainer key={entity} even={index % 2 == 0}>
              <div>{entity}</div>
              <ACLSelect value={access} handleChange={roleHandleChange} />
              <Button
                variant="outlined"
                color="danger"
                onClick={() => {
                  delete entities[entity]
                  handleChange({ [aclKey]: entities })
                }}
              >
                Remove
              </Button>
            </GridContainer>
          )
        })}
      </TableWrapper>
    </>
  )
}

export const AccessControlList = (props: {
  documentId: string
  dataSourceId: string
}): JSX.Element => {
  const { documentId, dataSourceId } = props

  const [activeTab, setActiveTab] = useState<number>(0)
  const [storeACLRecursively, setStoreACLRecursively] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingACLDocument, setLoadingACLDocument] = useState<boolean>(false)
  //@ts-ignore
  const { token } = useContext(AuthContext)
  const [refreshToken, setRefreshToken] = useLocalStorage(
    'ROCP_refreshToken',
    ''
  )
  const dmssAPI = new DmssAPI(token)

  const [documentACL, setDocumentACL] = useState<TAcl>({
    owner: '',
    roles: {},
    users: {},
    others: ACLEnum.READ,
  })

  const convertACLFromUsernameIdToUsername = async (
    acl: TAcl
  ): Promise<TAcl> => {
    const aclCopy: TAcl = JSON.parse(JSON.stringify(acl)) //deep copy the acl object
    const promises: Promise<UsernameIdMapping>[] = []
    Object.keys(aclCopy.users).map((usernameId: string) => {
      //@ts-ignore
      promises.push(getUsernameMappingFromId(usernameId, refreshToken))
    })
    const newUsers: { [key: string]: ACLEnum } = {}
    return Promise.all(promises)
      .then((usernameIdMappings: UsernameIdMapping[]) => {
        usernameIdMappings.map((usernameIdMapping: UsernameIdMapping) => {
          newUsers[usernameIdMapping.username] =
            aclCopy.users[usernameIdMapping.usernameId]
        })
        aclCopy.users = newUsers
      })
      .then(() => {
        //@ts-ignore
        return getUsernameMappingFromId(aclCopy.owner, refreshToken).then(
          (usernameIdMapping: UsernameIdMapping) => {
            if (usernameIdMapping.username) {
              aclCopy.owner = usernameIdMapping.username
            } else {
              aclCopy.owner = usernameIdMapping.usernameId
            }

            return aclCopy
          }
        )
      })
  }

  const convertACLFromUsernameToUsernameId = (acl: TAcl): Promise<TAcl> => {
    const aclCopy: TAcl = JSON.parse(JSON.stringify(acl)) //deep copy the acl object
    const promises: Promise<UsernameIdMapping>[] = []
    Object.keys(aclCopy.users).map((username: string) => {
      //@ts-ignore
      promises.push(getUsernameMappingFromUsername(username, refreshToken))
    })
    const newUsers: { [key: string]: ACLEnum } = {}
    return Promise.all(promises)
      .then((usernameIdMappings: UsernameIdMapping[]) => {
        usernameIdMappings.map(
          (usernameIdMapping: UsernameIdMapping, index) => {
            newUsers[usernameIdMapping.usernameId] =
              aclCopy.users[usernameIdMapping.username]
          }
        )
        aclCopy.users = newUsers
      })
      .then(() => {
        //@ts-ignore
        return getUsernameMappingFromUsername(aclCopy.owner, refreshToken).then(
          (usernameIdMapping: UsernameIdMapping) => {
            if (usernameIdMapping.usernameId) {
              aclCopy.owner = usernameIdMapping.usernameId
            } else {
              aclCopy.owner = usernameIdMapping.username
            }
            return aclCopy
          }
        )
      })
  }

  useEffect(() => {
    setLoadingACLDocument(true)
    dmssAPI
      .getDocumentAcl({ dataSourceId: dataSourceId, documentId: documentId })
      .then((response: TAcl) => {
        convertACLFromUsernameIdToUsername(response)
          .then((newACL: TAcl) => {
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
      .catch((error: any) => {
        NotificationManager.error(
          `Could not fetch ACL for this document (${error})`
        )
      })
  }, [documentId])

  async function saveACL(acl: TAcl) {
    setLoading(true)

    convertACLFromUsernameToUsernameId(acl)
      .then((newACL) => {
        dmssAPI.setDocumentAcl({
          dataSourceId: dataSourceId,
          documentId: documentId,
          //@ts-ignore - ACL class from geneated openAPI spec have wrong enum keys (NUMBER_2 instead of WRITE etc)
          aCL: newACL,
          recursively: storeACLRecursively,
        })
      })
      .then(() => {
        NotificationManager.success('ACL saved!')
      })
      .catch((error: any) => {
        NotificationManager.error(`Could not save ACL ${error}`)
      })
      .finally(() => setLoading(false))
  }

  function handleChange(value: Object) {
    setDocumentACL({ ...documentACL, ...value })
  }

  if (loadingACLDocument)
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
