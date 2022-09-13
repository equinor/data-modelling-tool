import React, { useContext, useState } from 'react'

import { Input, Label } from '@equinor/eds-core-react'
// @ts-ignore
import { NotificationManager } from 'react-notifications'
import {
  INPUT_FIELD_WIDTH,
  TREE_DIALOG_HEIGHT,
  TREE_DIALOG_WIDTH,
} from '../../utils/variables'
import { TReference } from '../../types'
import { Dialog } from '../Dialog'
import { TreeView } from '../TreeView'
import { TreeNode } from '../../domain/Tree'
import { FSTreeContext } from '../../context/FileSystemTreeContext'

export const EntityPickerInput = (props: {
  onChange: (ref: TReference) => void
  formData?: TReference
  typeFilter?: string
  label?: string
}) => {
  const { onChange, formData, typeFilter, label } = props
  const [showModal, setShowModal] = useState<boolean>(false)
  const { treeNodes } = useContext(FSTreeContext)

  return (
    <div>
      <Label label={label || 'Select entity'} />
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <Input
          type="string"
          value={formData?.name || formData?._id || ''}
          placeholder="Select"
          onClick={() => setShowModal(true)}
          style={{ width: INPUT_FIELD_WIDTH, cursor: 'pointer' }}
        />
        <Dialog
          isOpen={showModal}
          closeScrim={() => setShowModal(false)}
          header={'Select an Entity'}
          width={TREE_DIALOG_WIDTH}
          height={TREE_DIALOG_HEIGHT}
        >
          <TreeView
            nodes={treeNodes}
            onSelect={(node: TreeNode) => {
              if (node.type !== typeFilter) {
                NotificationManager.warning('Wrong type')
                return
              }
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
    </div>
  )
}
