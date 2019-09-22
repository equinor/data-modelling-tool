import React, { useState } from 'react'
import Modal from '../modal/Modal'
import { TreeNodeData } from '../tree-view/Tree'
import { NodeType } from '../../api/types'
import { BlueprintPickerContent } from '../../pages/common/blueprint-picker/BlueprintPicker'

type Props = {
  onChange: (event: any) => void
  value: string
}

export default (props: Props) => {
  const { value, onChange } = props
  const [blueprint, setBlueprint] = useState(value)
  const [showModal, setShowModal] = useState(false)

  const handleNodeSelect = (node: TreeNodeData) => {
    if (node.nodeType === NodeType.file) {
      setBlueprint(node.nodeId)
      setShowModal(false)
      onChange({ target: { value: node.nodeId } })
    }
  }

  return (
    <div>
      <input
        style={{ width: '100%' }}
        type="string"
        value={blueprint}
        onChange={() => {}}
        onClick={() => setShowModal(!showModal)}
      />
      <BlueprintPickerWrapper
        showModal={showModal}
        setShowModal={setShowModal}
        onSelect={handleNodeSelect}
      />
    </div>
  )
}

const BlueprintPickerWrapper = (props: any) => {
  const { setShowModal, showModal, onSelect } = props
  return (
    <Modal
      toggle={() => setShowModal(!showModal)}
      open={showModal}
      title="Select Blueprint"
    >
      <BlueprintPickerContent onSelect={onSelect} />
    </Modal>
  )
}
