import React, { useState } from 'react'
import { TreeNodeRenderProps } from '../../components/tree-view/TreeNode'
import { NodeType } from '../../api/types'
import Modal from '../../components/modal/Modal'
import { BlueprintPickerContent } from '../../pages/common/BlueprintPicker'

type Props = {
  onChange: (event: any) => void
  value: string
  attributeInput: any
}

export default (props: Props) => {
  const { value, onChange, attributeInput } = props
  const [documentType, setDocumentType] = useState(value)
  const [showModal, setShowModal] = useState(false)

  const handleNodeSelect = (renderProps: TreeNodeRenderProps) => {
    const node = renderProps.nodeData
    // TODO: This is now true for all nodes?\
    if (node.nodeType === NodeType.DOCUMENT_NODE) {
      const selectedNodePath = `${renderProps.path}/${node.title}`
      setDocumentType(selectedNodePath)
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
        value={documentType}
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
