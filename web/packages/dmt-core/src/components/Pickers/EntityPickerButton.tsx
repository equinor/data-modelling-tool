import React, { useContext, useEffect, useState } from 'react'

import { Button, Progress } from '@equinor/eds-core-react'
// @ts-ignore
import { NotificationManager } from 'react-notifications'
import { AuthContext } from 'react-oauth2-code-pkce'
import { TReference } from '../../types'
import { ApplicationContext } from '../../context/ApplicationContext'
import { Tree, TreeNode } from '../../domain/Tree'
import { Dialog } from '../Dialog'
import { TREE_DIALOG_HEIGHT, TREE_DIALOG_WIDTH } from '../../utils/variables'
import { TreeView } from '../TreeView'
import { truncatePathString } from '../../utils/truncatePathString'

export const EntityPickerButton = (props: {
  onChange: (ref: TReference) => void
  typeFilter?: string
  text?: string
  variant?: 'contained' | 'outlined' | 'ghost' | 'ghost_icon'
  scope?: string // Path to a folder to limit the view within
}) => {
  const { onChange, typeFilter, text, variant, scope } = props
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
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Progress.Circular />
          </div>
        ) : (
          <TreeView
            nodes={treeNodes}
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
        )}
      </Dialog>
    </div>
  )
}
