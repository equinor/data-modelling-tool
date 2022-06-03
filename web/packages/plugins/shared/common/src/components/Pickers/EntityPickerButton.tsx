import React, { useState } from 'react'
import {
  Dialog,
  TREE_DIALOG_HEIGHT,
  TREE_DIALOG_WIDTH,
  TreeNode,
  TreeView,
  TReference,
  truncatePathString,
} from '../../index'
import { Button } from '@equinor/eds-core-react'
// @ts-ignore
import { NotificationManager } from 'react-notifications'

export const EntityPickerButton = (props: {
  onChange: (ref: TReference) => void
  typeFilter?: string
  text?: string
  variant?: 'contained' | 'outlined' | 'ghost' | 'ghost_icon'
}) => {
  const { onChange, typeFilter, text, variant } = props
  const [showModal, setShowModal] = useState<boolean>(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'row', margin: '0 10px' }}>
      <Button
        variant={variant || 'contained'}
        onClick={() => setShowModal(true)}
      >
        {text || 'Select'}
      </Button>
      <Dialog
        isOpen={showModal}
        closeScrim={() => setShowModal(false)}
        header={'Select an Entity'}
        width={TREE_DIALOG_WIDTH}
        height={TREE_DIALOG_HEIGHT}
      >
        <TreeView
          onSelect={(node: TreeNode) => {
            if (typeFilter && node.type !== typeFilter) {
              NotificationManager.warning(
                `Type must be '${truncatePathString(typeFilter, 43)}'`
              )
              return
            }
            setShowModal(false)
            node
              .fetch()
              .then((doc: any) => {
                setShowModal(false)
                onChange(doc)
              })
              .catch((error: any) => {
                console.error(error)
                NotificationManager.error('Failed to fetch')
              })
          }}
        />
      </Dialog>
    </div>
  )
}
