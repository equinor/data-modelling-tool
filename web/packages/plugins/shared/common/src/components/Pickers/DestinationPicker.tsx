import React, { useContext, useEffect, useState } from 'react'
import {
  PATH_INPUT_FIELD_WIDTH,
  TREE_DIALOG_HEIGHT,
  TREE_DIALOG_WIDTH,
} from '../../utils/variables'
import { EBlueprint } from '../../Enums'
import {
  NodeWrapperProps,
  TreeNode,
  TreeView,
  truncatePathString,
  Dialog,
  AuthContext,
  ApplicationContext,
  Tree,
} from '../../index'
import {
  Button,
  Input,
  Label,
  Progress,
  Tooltip,
} from '@equinor/eds-core-react'
import styled from 'styled-components'

export type DestinationPickerProps = {
  onChange: (value: any) => void
  formData: any
  disabled?: boolean
  scope?: string // Path to a folder to limit the view within
  label?: string
}

export const DestinationPicker = (props: DestinationPickerProps) => {
  const { onChange, formData, disabled, scope, label } = props
  const { token } = useContext(AuthContext)
  const appConfig = useContext(ApplicationContext)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [treeNodes, setTreeNodes] = useState<TreeNode[]>([])

  const tree: Tree = new Tree(
    token,
    // @ts-ignore
    (t: Tree) => setTreeNodes([...t])
  )

  useEffect(() => {
    setLoading(true)
    if (scope) {
      tree.initFromFolder(scope).finally(() => setLoading(false))
    } else {
      tree
        .initFromDataSources(appConfig.visibleDataSources)
        .finally(() => setLoading(false))
    }
  }, [scope])

  const onSelect = (node: TreeNode) => {
    onChange(node.getPath())
    setShowModal(false)
  }

  return (
    <div>
      <Label label={label || 'Destination'} />
      <Tooltip
        title={truncatePathString(formData) === formData ? '' : formData}
      >
        <Input
          style={{
            width: PATH_INPUT_FIELD_WIDTH,
            cursor: 'pointer',
          }}
          disabled={disabled || false}
          type="string"
          value={truncatePathString(formData)}
          onChange={() => {}}
          placeholder="Select folder"
          onClick={() => setShowModal(true)}
        />
      </Tooltip>
      <Dialog
        isOpen={showModal}
        closeScrim={() => setShowModal(false)}
        header={'Select a folder'}
        width={TREE_DIALOG_WIDTH}
        height={TREE_DIALOG_HEIGHT}
      >
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Progress.Circular />
          </div>
        ) : (
          <TreeView
            nodes={treeNodes}
            onSelect={() => {}}
            NodeWrapper={SelectPackageButton}
            NodeWrapperOnClick={onSelect}
          />
        )}
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
      {node.type === EBlueprint.PACKAGE && (
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
