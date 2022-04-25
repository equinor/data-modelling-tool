// @ts-ignore
import React, { useContext, useState } from 'react'
// @ts-ignore
import { NotificationManager } from 'react-notifications'
import { BlueprintEnum } from '../../utils/variables'
import { Modal, TreeNode, TreeView } from '../../index'
import { Input } from '@equinor/eds-core-react'
import { truncatePathString } from '../../../../../apps/analysis-platform/src/utils/truncatePathString'

export const BlueprintPicker = (props: {
  onChange: (type: string) => void
  formData: string
}) => {
  const { onChange, formData } = props
  const [showModal, setShowModal] = useState<boolean>(false)

  const example = 'AnalysisDS/Blueprints/Common/SubFolder3/RaceCarEngine'

  return (
    <div style={{ width: '80%' }}>
      <Input
        style={{ width: '450px', margin: '0 8px', cursor: 'pointer' }}
        type="string"
        value={truncatePathString(formData)}
        onChange={() => {}}
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
