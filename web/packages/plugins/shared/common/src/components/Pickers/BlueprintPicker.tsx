// @ts-ignore
import React, { useContext, useState } from 'react'
// @ts-ignore
import { NotificationManager } from 'react-notifications'
import { BlueprintEnum } from '../../utils/variables'
import { Modal, TreeNode, TreeView } from '../../index'
import { Input, Tooltip } from '@equinor/eds-core-react'
import { PATH_INPUT_FIELD_WIDTH, truncatePathString } from '@dmt/common'

export const BlueprintPicker = (props: {
  onChange: (type: string) => void
  formData: string
}) => {
  const { onChange, formData } = props
  const [showModal, setShowModal] = useState<boolean>(false)

  return (
    <div style={{ width: '80%', paddingBottom: '8px' }}>
      <Tooltip
        title={truncatePathString(formData) === formData ? '' : formData}
      >
        <Input
          style={{
            width: PATH_INPUT_FIELD_WIDTH,
            cursor: 'pointer',
          }}
          type="string"
          value={truncatePathString(formData)}
          onChange={() => {}}
          placeholder="Select"
          onClick={() => setShowModal(true)}
        />
      </Tooltip>
      <Modal
        toggle={() => setShowModal(!showModal)}
        open={showModal}
        title={'Select a blueprint as type'}
      >
        <TreeView
          onSelect={(node: TreeNode) => {
            if (node.type !== BlueprintEnum.BLUEPRINT) {
              NotificationManager.warning('You can only select a blueprint')
              return
            } // Only allowed to select blueprints
            setShowModal(false)
            onChange(node.getPath())
          }}
        />
      </Modal>
    </div>
  )
}
