import React, { useState } from 'react'
import {
  Modal,
  TreeNode,
  TreeView,
  TReference,
  truncatePathString,
} from '../../index'
import { Input, Tooltip } from '@equinor/eds-core-react'
// @ts-ignore
import { NotificationManager } from 'react-notifications'

export const EntityPickerInput = (props: {
  onChange: (ref: TReference) => void
  formData?: TReference
  typeFilter?: string
}) => {
  const { onChange, formData, typeFilter } = props
  const [showModal, setShowModal] = useState<boolean>(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <Tooltip title={formData?.name || formData?._id || ''}>
        <Input
          type="string"
          value={truncatePathString(formData?.name || formData?._id || '')}
          placeholder="Select"
          onChange={() => {}}
          onClick={() => setShowModal(true)}
          style={{ width: '18vw', margin: '0 8px', cursor: 'pointer' }}
        />
      </Tooltip>
      <Modal
        toggle={() => setShowModal(!showModal)}
        open={showModal}
        title={'Select an Entity'}
      >
        <TreeView
          onSelect={(node: TreeNode) => {
            if (node.type !== typeFilter) {
              NotificationManager.warning('Wrong type')
              return
            }
            setShowModal(false)
            onChange({
              name: node.name ? node.name : '',
              type: node.type ? node.type : '',
              _id: node.nodeId,
            })
          }}
        />
      </Modal>
    </div>
  )
}
