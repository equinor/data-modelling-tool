// @ts-ignore
import React, { useContext, useState } from 'react'
import { BlueprintEnum } from '../../utils/variables'
import { Modal, TreeNode, TreeView } from '../../index'
import { Input } from '@equinor/eds-core-react'

export const SimpleBlueprintPicker = (props: {
  onChange: (type: string) => void
  formData: string
  blueprintFilter?: string
}) => {
  const {
    onChange,
    formData,
    blueprintFilter = BlueprintEnum.BLUEPRINT,
  } = props
  const [showModal, setShowModal] = useState<boolean>(false)

  return (
    <div style={{ width: '100%' }}>
      <Input
        style={{ width: '280px', margin: '0 8px', cursor: 'pointer' }}
        type="string"
        value={formData}
        placeholder="Select"
        onClick={() => setShowModal(true)}
      />
      <Modal
        toggle={() => setShowModal(!showModal)}
        open={showModal}
        title={'Select a blueprint as type'}
      >
        <TreeView
          onSelect={(node: TreeNode) => {
            if (node.type !== blueprintFilter) return // Only allowed to select blueprints
            setShowModal(false)
            onChange(node.getPath())
          }}
        />
      </Modal>
    </div>
  )
}
