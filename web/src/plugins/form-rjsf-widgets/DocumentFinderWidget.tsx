import React, { useState } from 'react'
import { TreeNodeRenderProps } from '../../components/tree-view/TreeNode'
import Modal from '../../components/modal/Modal'
import { FilePicker } from '../../pages/common/FilePicker'
import { NodeType } from '../../util/variables'

export type Props = {
  onChange: (event: any) => void
  value: string
  attributeInput: any
  packagesOnly: boolean
  title: string
  hint: string
}

export default (props: Props) => {
  const { value, onChange, attributeInput, packagesOnly, title, hint } = props
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
      }
      if (packagesOnly) {
        onChange(node.nodeId)
      } else {
        onChange(selectedNodePath)
      }
    }
  }

  return (
    <>
      <b>{title}</b>
      <div>
        <input
          style={{ width: '100%' }}
          type="string"
          value={documentType || ''}
          onChange={() => {}}
          onClick={() => setShowModal(!showModal)}
        />
        <FilePickerModal
          showModal={showModal}
          setShowModal={setShowModal}
          onSelect={handleNodeSelect}
          packagesOnly={packagesOnly}
          hint={hint}
        />
      </div>
    </>
  )
}

const FilePickerModal = (props: any) => {
  const { setShowModal, showModal, onSelect, packagesOnly, hint } = props
  return (
    <Modal
      toggle={() => setShowModal(!showModal)}
      open={showModal}
      title={hint}
    >
      <FilePicker onSelect={onSelect} packagesOnly={packagesOnly} />
    </Modal>
  )
}
