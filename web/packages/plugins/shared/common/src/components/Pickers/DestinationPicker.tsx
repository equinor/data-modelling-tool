// @ts-ignore
import React, { useContext, useEffect, useState } from 'react'
import { BlueprintEnum, INPUT_FIELD_WIDTH } from '../../utils/variables'
import {
  Modal,
  NodeWrapperProps,
  TreeNode,
  TreeView,
  truncatePathString,
} from '../../index'
import { Button, Input, Tooltip } from '@equinor/eds-core-react'
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
    <div style={{ paddingBottom: '8px' }}>
      <Tooltip
        title={truncatePathString(formData) === formData ? '' : formData}
      >
        <Input
          style={{
            width: INPUT_FIELD_WIDTH,
            cursor: 'pointer',
          }}
          type="string"
          value={truncatePathString(formData)}
          onChange={() => {}}
          placeholder="Select"
          onClick={() => setShowModal(true)}
        />
      </Tooltip>
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
