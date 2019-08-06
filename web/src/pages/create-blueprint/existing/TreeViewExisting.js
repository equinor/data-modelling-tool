import React, { useEffect } from 'react'
import values from 'lodash/values'
import Header from '../../../components/Header'
import { FilesActions } from './TreeViewExistingReducer'
import { Actions } from '../blueprint/CreateBluePrintReducer'
import TreeNode from '../../../components/tree-view/TreeNode'
import SearchTree from '../../../components/tree-view/SearchTree'
import { CreatePackageButton } from './CreatePackageButton'
import axios from 'axios'

export default props => {
  const {
    createBluePrint,
    onSelect,
    dispatch,
    filesDispatch,
    filesState,
  } = props

  useEffect(() => {
    async function fetchData() {
      const urlBluePrints = '/api/index/blueprints'
      const responseBlueprints = await axios(urlBluePrints)
      filesDispatch(
        FilesActions.addAssets(
          responseBlueprints.data,
          urlBluePrints.replace('/index', '')
        )
      )
      const urlRootEntities = '/api/index/entities_root_packages'
      const responseRootEntities = await axios(urlRootEntities)
      filesDispatch(
        FilesActions.addAssets(
          responseRootEntities.data,
          urlRootEntities.replace('/index', '')
        )
      )
    }
    fetchData()
  }, []) // empty array

  const onToggle = node => {
    filesDispatch(FilesActions.toggleNode(node.path))
  }

  const addPackage = node => {
    let name = prompt('Please enter name of new sub package', 'subpackage')
    filesDispatch(FilesActions.addPackage(node.path, name))
  }

  const rootNodes = values(filesState).filter(n => n.isRoot)
  return (
    <div>
      <Header>
        <h3>Files</h3>
        <CreatePackageButton dispatch={filesDispatch} />
      </Header>

      <div>
        <div>
          <SearchTree
            onChange={value => filesDispatch(FilesActions.filterTree(value))}
          />
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
            if (node.isRoot) {
              menuItems.push({
                type: 'folder',
                action: ' edit-root-package',
                // todo set existing root package in form.
                onClick: () => alert('edit root package'),
                label: 'Edit root package',
              })
            }

            return (
              <TreeNode
                key={node.path}
                node={node}
                nodes={filesState}
                existing={true}
                onToggle={onToggle}
                menuItems={menuItems}
                onNodeSelect={node => {
                  if (node.type === 'file') {
                    dispatch(Actions.setSelectedTemplatePath(node.path))
                  }
                }}
              />
            )
          })}
      </div>
    </div>
  )
}
