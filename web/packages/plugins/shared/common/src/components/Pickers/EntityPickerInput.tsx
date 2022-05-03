import React, { useState } from 'react'
import { Modal, TreeNode, TreeView, TReference } from '../../index'
import { Input } from '@equinor/eds-core-react'
// @ts-ignore
import { NotificationManager } from 'react-notifications'
import { INPUT_FIELD_WIDTH } from '../../utils/variables'

export const EntityPickerInput = (props: {
  onChange: (ref: TReference) => void
  formData?: TReference
  typeFilter?: string
}) => {
  const { onChange, formData, typeFilter } = props
  const [showModal, setShowModal] = useState<boolean>(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <Input
        type="string"
        value={formData?.name || formData?._id || ''}
        placeholder="Select"
        onChange={() => {}}
        onClick={() => setShowModal(true)}
        style={{ width: INPUT_FIELD_WIDTH, cursor: 'pointer' }}
      />
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
