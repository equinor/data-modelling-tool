import React, { useContext, useEffect, useState } from 'react'
import {
  PATH_INPUT_FIELD_WIDTH,
  TREE_DIALOG_HEIGHT,
  TREE_DIALOG_WIDTH,
} from '../../utils/variables'
import { EBlueprint } from '../../Enums'
import { TNodeWrapperProps, TreeView } from '../TreeView'

import {
  Button,
  Input,
  Label,
  Progress,
  Tooltip,
} from '@equinor/eds-core-react'
import styled from 'styled-components'
import { ApplicationContext } from '../../context/ApplicationContext'
import { truncatePathString } from '../../utils/truncatePathString'
import { AuthContext, AuthProvider } from 'react-oauth2-code-pkce'
import { Tree, TreeNode } from '../../domain/Tree'
import { Dialog } from '../Dialog'

type TDestinationPickerProps = {
  onChange: (value: string) => void
  formData: string
  disabled?: boolean
  scope?: string // Path to a folder to limit the view within
  label?: string
}

export const DestinationPicker = (props: TDestinationPickerProps) => {
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
      <Tooltip title={formData || 'None selected'}>
        <Input
          style={{
            width: PATH_INPUT_FIELD_WIDTH,
            cursor: 'pointer',
          }}
          disabled={disabled || false}
          type="string"
          value={truncatePathString(formData)}
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
            // eslint-disable-next-line @typescript-eslint/no-empty-function
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
export const SelectPackageButton = (props: TNodeWrapperProps) => {
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
              if (onSelect) {
                return onSelect(node)
              }
            }}
          >
            Select
          </Button>
        </div>
      )}
    </Wrapper>
  )
}
