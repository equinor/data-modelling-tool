import React, { useReducer, useState } from 'react'
import Modal from '../modal/Modal'
import { BlueprintPickerContent } from '../../pages/entities/BlueprintPicker'
import BlueprintReducer, {
  initialState,
} from '../../pages/common/DocumentReducer'
import { TreeNodeData } from '../tree-view/Tree'
import { NodeType } from '../tree-view/TreeReducer'

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
      //TODO: return    my-data-source/blueprintID
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
  const [state, dispatch] = useReducer(BlueprintReducer, initialState)
  return (
    <Modal toggle={() => setShowModal(!showModal)} open={showModal}>
      <BlueprintPickerContent
        state={state}
        dispatch={dispatch}
        onNodeSelect={onSelect}
      />
    </Modal>
  )
}
