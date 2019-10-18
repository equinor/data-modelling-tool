import React, { useState } from 'react'
import Modal from '../modal/Modal'
import { NodeType } from '../../api/types'
import { BlueprintPickerContent } from '../../pages/common/BlueprintPicker'
import { RenderProps } from '../../pages/common/tree-view/DocumentTree'

type Props = {
  onChange: (event: any) => void
  value: string
  formData: any
}

// Removes every other element in the path following datasource.
function stripPackageAttributesFromPath(path: string) {
  let elements = path.split('/')
  const dataSource = elements[0]
  elements.splice(0, 1)
  const odd_elements = elements.filter(function(value, index) {
    index -= 1
    return index % 2 !== 0
  })
  return `${dataSource}/${odd_elements.join('/')}`
}

export default (props: any) => {
  const { value, onChange, attributeInput } = props
  const [blueprint, setBlueprint] = useState(value)
  const [showModal, setShowModal] = useState(false)

  const handleNodeSelect = (renderProps: RenderProps) => {
    const node = renderProps.treeNodeData
    // TODO: This is now true for all nodes?
    if (node.nodeType === NodeType.DOCUMENT_NODE) {
      const selectedNodePath = stripPackageAttributesFromPath(
        `${renderProps.path}/${node.title}`
      )
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
