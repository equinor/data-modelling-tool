import { Icon, Input } from '@equinor/eds-core-react'
import { ACLSelect } from './ACLSelect'
import { AccessLevel, ACL } from '../../services'
import React from 'react'
import { CenteredRow } from './AccessControlList'

interface IACLOwnerPanelProps {
  acl: ACL
  handleChange: (data: Partial<ACL>) => void
}

export const ACLOwnerPanel = ({
  acl,
  handleChange,
}: IACLOwnerPanelProps): JSX.Element => {
  return (
    <>
      <CenteredRow width={'230px'}>
        Owner:
        <Input
          style={{ width: '150px', marginLeft: '5px' }}
          placeholder={acl.owner}
          onChange={(event) => handleChange({ owner: event.target.value })}
        />
        <Icon name="edit_text" size={24} style={{ color: 'teal' }} />
      </CenteredRow>
      <CenteredRow width={'160px'}>
        Others:
        <ACLSelect
          value={acl.others || AccessLevel.NONE}
          handleChange={(newValue: AccessLevel) =>
            handleChange({ others: newValue })
          }
        />
      </CenteredRow>
    </>
  )
}
