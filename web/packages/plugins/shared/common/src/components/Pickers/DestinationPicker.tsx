// @ts-ignore
import React, { useContext, useEffect, useState } from 'react'
import { BlueprintEnum } from '../../utils/variables'
import { Modal, NodeWrapperProps, TreeNode, TreeView } from '../../index'
import { Button, Input } from '@equinor/eds-core-react'
import styled from 'styled-components'

export type DestinationPickerProps = {
  onChange: (value: any) => void
  formData: any
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
      <div>
        <Input
          style={{ width: '360px', margin: '0 8px', cursor: 'pointer' }}
          type="string"
          value={formData}
          onChange={() => {}}
          placeholder="Select"
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

const Wrapper = styled.div`
  display: flex;
  &:hover {
    background-color: #acb7da;
  }
`
export const SelectPackageButton = (props: NodeWrapperProps) => {
  const { node, children, onSelect } = props

  return (
    <Wrapper>
      {children}
      {node.type === BlueprintEnum.PACKAGE ? (
        <div style={{ padding: '0 5px', backgroundColor: 'white' }}>
          <Button
            style={{ height: '22px' }}
            variant="ghost"
            onClick={() => {
              onSelect!(node)
            }}
          >
            Select
          </Button>
        </div>
      ) : null}
    </Wrapper>
  )
}
