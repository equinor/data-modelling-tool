import React, { useState } from 'react'
import { BlueprintEnum } from '../../utils/variables'
import { Modal, TreeNode, TreeView, TReference } from '../../index'
import { Input } from '@equinor/eds-core-react'

export const EntityPicker = (props: {
  onChange: (ref: TReference) => void
  formData?: TReference
  blueprintFilter?: string
}) => {
  // TODO: Valid types should be passed to this, and filtered for in the view
  const { onChange, formData, blueprintFilter = BlueprintEnum.PACKAGE } = props
  const [showModal, setShowModal] = useState<boolean>(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <Input
        type="string"
        value={formData?.name || formData?._id || ''}
        placeholder="Select"
        onClick={() => setShowModal(true)}
        style={{ width: '280px', margin: '0 8px', cursor: 'pointer' }}
      />
      <Modal
        toggle={() => setShowModal(!showModal)}
        open={showModal}
        title={'Select an Entity'}
      >
        <TreeView
          onSelect={(node: TreeNode) => {
            if (node.type === blueprintFilter) return
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
