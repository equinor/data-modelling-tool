// @ts-ignore
import React, { useContext, useEffect, useState } from 'react'
import { BlueprintEnum } from '../../utils/variables'
import { Modal, NodeWrapperProps, TreeNode, TreeView } from '../../index'
import { Button, Input } from '@equinor/eds-core-react'

export type DestinationPickerProps = {
  onChange: (value: any) => void
  formData: any
  title?: string
}

export const DestinationPicker = (props: DestinationPickerProps) => {
  const { onChange, formData } = props
  const [showModal, setShowModal] = useState<boolean>(false)

  const onSelect = (node: TreeNode) => {
    onChange(node.getPath())
    setShowModal(false)
  }

  return (
    <>
      <div style={{ width: '100vw' }}>
        <Input
          style={{ width: '19vw', margin: '0 8px', cursor: 'pointer' }}
          type="string"
          value={formData}
          onClick={() => setShowModal(true)}
        />
        <Modal
          toggle={() => setShowModal(!showModal)}
          open={showModal}
          title={'Select a folder as destination'}
        >
          <TreeView
            onSelect={() => {}}
            NodeWrapper={SelectPackageButton}
            NodeWrapperOnClick={onSelect}
          />
        </Modal>
      </div>
    </>
  )
}

export const SelectPackageButton = (props: NodeWrapperProps) => {
  const { node, children, onSelect } = props

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      {children}
      {node.type === BlueprintEnum.PACKAGE ? (
        <Button
          style={{ height: '22px' }}
          variant="ghost"
          onClick={() => {
            onSelect!(node)
          }}
        >
          Select
        </Button>
      ) : null}
    </div>
  )
}
