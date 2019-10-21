import React, { useState } from 'react'
import Modal from '../modal/Modal'
import { NodeType } from '../../api/types'
import { BlueprintPickerContent } from '../../pages/common/BlueprintPicker'
import { TreeNodeRenderProps } from '../tree-view/TreeNode'

type Props = {
  onChange: (event: any) => void
  value: string
  formData: any
}

export default (props: any) => {
  const { value, onChange, attributeInput } = props
  const [blueprint, setBlueprint] = useState(value)
  const [showModal, setShowModal] = useState(false)

  const handleNodeSelect = (renderProps: TreeNodeRenderProps) => {
    const node = renderProps.nodeData
    // TODO: This is now true for all nodes?\
    if (node.nodeType === NodeType.DOCUMENT_NODE) {
      const selectedNodePath = `${renderProps.path}/${node.title}`
      setBlueprint(selectedNodePath)
      setShowModal(false)

      if (attributeInput) {
        onChange({ target: { value: selectedNodePath } })
      } else {
        onChange(selectedNodePath)
      }
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
