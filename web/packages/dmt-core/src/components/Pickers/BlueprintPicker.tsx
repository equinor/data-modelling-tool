import React, { useContext, useState } from 'react'
// @ts-ignore
import { NotificationManager } from 'react-notifications'
import {
  PATH_INPUT_FIELD_WIDTH,
  TREE_DIALOG_HEIGHT,
  TREE_DIALOG_WIDTH,
} from '../../utils/variables'
import { EBlueprint } from '../../Enums'

import { Input, Label, Progress, Tooltip } from '@equinor/eds-core-react'
import { Variants } from '@equinor/eds-core-react/dist/types/components/TextField/types'
import { FSTreeContext } from '../../context/FileSystemTreeContext'
import { truncatePathString } from '../../utils/truncatePathString'
import { Dialog } from '../Dialog'
import { TreeView } from '../TreeView'
import { TreeNode } from '../../domain/Tree'

export type TBlueprintPickerProps = {
  /** A function to trigger with the onChange event */
  onChange: (type: string) => void
  /** The value of the input field */
  formData: string | undefined
  /** The variant to use for the input ('error', 'warning', 'success', 'default') */
  variant?: Variants
  /** Whether the input should be disabled */
  disabled?: boolean
  /** A title for the picker */
  label?: string
}

/**
 * Component which renders a blueprint picker,
 * allowing the user to select a reference to a blueprint
 *
 * @docs Components
 * @scope BlueprintPicker Dialog
 *
 * @usage
 * ```
 * <BlueprintPicker
 *   label={'Select a Blueprint'}
 *   disabled={false}
 *   onChange={(selectedType) => console.log(`Selected blueprint of type '${selectedType}'`)} />
 * ```
 *
 * @param {TBlueprintPickerProps} props {@link TBlueprintPickerProps}
 * @returns A React component
 */
export const BlueprintPicker = (props: TBlueprintPickerProps) => {
  const { onChange, formData, variant, disabled, label } = props
  const [showModal, setShowModal] = useState<boolean>(false)
  const { treeNodes, loading } = useContext(FSTreeContext)

  return (
    <div>
      <Label label={label || 'Blueprint'} />
      <Tooltip
        title={truncatePathString(formData) === formData ? '' : formData}
      >
        <Input
          disabled={disabled}
          variant={variant || 'default'}
          style={{
            width: PATH_INPUT_FIELD_WIDTH,
            cursor: 'pointer',
          }}
          type="string"
          value={truncatePathString(formData)}
          placeholder="Select"
          onClick={() => setShowModal(true)}
        />
      </Tooltip>
      <Dialog
        isOpen={showModal}
        closeScrim={() => setShowModal(false)}
        header={`Select a blueprint as type`}
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
            onSelect={(node: TreeNode) => {
              if (node.type !== EBlueprint.BLUEPRINT) {
                NotificationManager.warning('You can only select a blueprint')
                return
              } // Only allowed to select blueprints
              setShowModal(false)
              onChange(node.getPath())
            }}
          />
        )}
      </Dialog>
    </div>
  )
}
