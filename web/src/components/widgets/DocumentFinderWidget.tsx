import React, { useState } from 'react'
import Modal from '../modal/Modal'
import { NodeType } from '../../api/types'
import { BlueprintPickerContent } from '../../pages/common/blueprint-picker/BlueprintPicker'
import { RenderProps } from '../../pages/common/tree-view/DocumentTree'

type Props = {
  onChange: (event: any) => void
  value: string
  formData: any
}

export default (props: any) => {
  const { value, onChange } = props
  const [blueprint, setBlueprint] = useState(value)
  const [showModal, setShowModal] = useState(false)

  const handleNodeSelect = (renderProps: RenderProps) => {
    const node = renderProps.treeNodeData
    // TODO: This is now true for all nodes?
    if (node.nodeType === NodeType.DOCUMENT_NODE) {
      setBlueprint(`${renderProps.path}/${node.title}`)
      setShowModal(false)
      // TODO: This probably broke BlueprintPicker...
      // props.onChange(`${renderProps.path}/${node.title}`)
      onChange(`${renderProps.path}/${node.title}`)
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
