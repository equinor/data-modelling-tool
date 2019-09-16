import React, { useState } from 'react'
import FileUpload from '../../common/tree-view/FileUpload'
import styled from 'styled-components'
import { TreeNodeData } from '../../../components/tree-view/Tree'
import { MenuItem } from '../../../components/context-menu/ContextMenu'
import { FaFolder } from 'react-icons/fa'
import { ActionConfig } from '../../common/context-menu-actions/Types'
import { createPackage } from '../../common/context-menu-actions/CreatePackage'
import WithContextMenu from '../../common/context-menu-actions/WithContextMenu'

type Props = {
  node: TreeNodeData
  state: any
}

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

export const DataSourceNode = (props: Props) => {
  const { node, state } = props
  const [showModal, setShowModal] = useState(false)

  const menuItems: MenuItem[] = [
    {
      label: 'New',
      menuItems: [
        {
          label: 'Package',
          action: 'New Package',
          icon: FaFolder,
        },
      ],
    },
    {
      action: 'Edit Data Source',
      label: 'Edit',
    },
  ]

  const configs: ActionConfig[] = [
    {
      action: 'New Package',
      formProps: createPackage({ node }), // TODO: Wrong function
    },
    {
      action: 'Edit Data Source',
      formProps: {
        // TODO
      },
    },
  ]

  return (
    <Wrapper>
      <WithContextMenu
        node={node}
        menuItems={menuItems}
        configs={configs}
        showModal={showModal}
        setShowModal={setShowModal}
      />
      {node.nodeId === 'local' && (
        <FileUpload state={state} datasource={state.dataSources[0]} />
      )}
    </Wrapper>
  )
}
