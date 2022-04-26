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

  const inputValue = formData?.name || formData?._id || ''

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <Tooltip
        title={truncatePathString(inputValue) === inputValue ? '' : inputValue}
      >
        <Input
          type="string"
          value={truncatePathString(inputValue)}
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
            node
              .fetch()
              .then((doc: any) => {
                setShowModal(false)
                onChange(doc)
              })
              .catch((error: any) => {
                console.error(error)
                NotificationManager.error('Failed to fetch')
              })
          }}
        />
      </Modal>
    </div>
  )
}
