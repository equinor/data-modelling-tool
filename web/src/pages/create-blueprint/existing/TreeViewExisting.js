import React, { useEffect } from 'react'
import values from 'lodash/values'
import Header from '../../../components/Header'
import { Actions } from './TreeViewExistingReducer'
import TreeNode from '../../../components/tree-view/TreeNode'
import SearchTree from '../../../components/tree-view/SearchTree'
import { CreatePackageButton } from './CreatePackageButton'
import axios from 'axios'

export default props => {
  const { createBluePrint, onSelect, dispatch, state } = props

  useEffect(() => {
    async function fetchData() {
      const urlBluePrints = '/api/index/blueprints'
      const responseBlueprints = await axios(urlBluePrints)
      dispatch(
        Actions.addAssets(
          responseBlueprints.data,
          urlBluePrints.replace('/index', '')
        )
      )
    }
    fetchData()
  }, []) // empty array

  const onToggle = node => {
    dispatch(Actions.toggleNode(node.path))
  }

  const addPackage = node => {
    let name = prompt('Please enter name of new sub package', 'subpackage')
    dispatch(Actions.addPackage(node.path, name))
  }

  const rootNodes = values(state).filter(n => n.isRoot)
  return (
    <div>
      <Header>
        <h3>Files</h3>
        <CreatePackageButton dispatch={dispatch} />
      </Header>

      <div>
        <div>
          <SearchTree onChange={value => dispatch(Actions.filterTree(value))} />
        </div>
        {rootNodes
          .filter(node => !node.isHidden)
          .map(node => {
            const menuItems = [
              {
                type: 'folder',
                action: 'create-blueprint',
                onClick: () => createBluePrint(node),
                label: 'Create blueprint',
              },
              // commented out until functionality is implemented.
              {
                type: 'folder',
                action: 'add-package',
                onClick: () => addPackage(node),
                label: 'Create Package',
              },
              // 	{ action: 'add-file', onClick: () => addFile(node), label: 'Add File' },
            ]

            return (
              <TreeNode
                key={node.path}
                node={node}
                nodes={state}
                existing={true}
                onToggle={onToggle}
                menuItems={menuItems}
                onNodeSelect={onSelect}
              />
            )
          })}
      </div>
    </div>
  )
}
