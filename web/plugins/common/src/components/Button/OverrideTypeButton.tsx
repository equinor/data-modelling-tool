import React, { useState } from 'react'
import { Modal } from '../Modal'
import { BlueprintEnum } from '../../utils/variables'
import { Selector } from '../Pickers'

export type OverrideTypeButtonProps = {
  onChange: Function
  formData: any
  blueprintFilter?: BlueprintEnum
}

export const OverrideTypeButton = (props: OverrideTypeButtonProps) => {
  const { onChange, blueprintFilter = BlueprintEnum.BLUEPRINT } = props
  const [showModal, setShowModal] = useState<boolean>(false)

  const selectorProps = {
    setShowModal,
    onChange,
    blueprintFilter,
  }

  return (
    <div>
      <button onClick={() => setShowModal(!showModal)}>Override type</button>
      <Modal
        toggle={() => setShowModal(!showModal)}
        open={showModal}
        title={'Select a blueprint as type'}
      >
        <Selector {...selectorProps} />
      </Modal>
    </div>
  )
}
