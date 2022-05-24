import React, { useState } from 'react'
import {
  BlueprintEnum,
  PATH_INPUT_FIELD_WIDTH,
  TREE_DIALOG_HEIGHT,
  TREE_DIALOG_WIDTH,
} from '../../utils/variables'
import {
  NodeWrapperProps,
  TreeNode,
  TreeView,
  truncatePathString,
  Dialog,
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
    <div>
      <Tooltip
        title={truncatePathString(formData) === formData ? '' : formData}
      >
        <Input
          style={{
            width: PATH_INPUT_FIELD_WIDTH,
            cursor: 'pointer',
          }}
          type="string"
          value={truncatePathString(formData)}
          onChange={() => {}}
          placeholder="Select destination"
          onClick={() => setShowModal(true)}
        />
      </Tooltip>
      <Dialog
        isOpen={showModal}
        closeScrim={() => setShowModal(false)}
        header={'Select a folder as destination'}
        width={TREE_DIALOG_WIDTH}
        height={TREE_DIALOG_HEIGHT}
      >
        <TreeView
          onSelect={() => {}}
          NodeWrapper={SelectPackageButton}
          NodeWrapperOnClick={onSelect}
        />
      </Dialog>
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
      {node.type === BlueprintEnum.PACKAGE && (
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
      )}
    </Wrapper>
  )
}
