import React, { useReducer } from 'react'
import values from 'lodash/values'
import Header from '../../../components/Header'
import treeViewExistingReducer, { Actions } from './TreeViewExistingReducer'
import templatesIndex from '../json/index_templates'
import blueprintsIndex from '../json/index_blueprints'
import TreeNode from '../../../components/tree-view/TreeNode'
import SearchTree from '../../../components/tree-view/SearchTree'
import { generateTreeview } from '../../../util/generateTreeview'

const initialState = Object.assign(
  {},
  generateTreeview(templatesIndex, 'api/templates'),
  generateTreeview(blueprintsIndex, 'api/templates')
)

export default props => {
  const { addAsset } = props

  const [state, dispatch] = useReducer(treeViewExistingReducer, initialState)

  console.log(state)
  const addRootPackage = () => {
    let name = prompt('Please enter name of new package', 'New Package')
    const newRootPath = `/${name}`
    dispatch(Actions.addRootPackage(newRootPath))
  }

  const onToggle = node => {
    dispatch(Actions.toggleNode(node.path))
  }

  const addPackage = node => {
    let name = prompt('Please enter name of new sub package', 'subpackage')
    dispatch(Actions.addPackage(node.path, name))
  }

  const addFile = node => {
    let name = prompt('Please enter name of new file', 'newfile')
    const content = 'this is a awesome new file'
    dispatch(Actions.addFile(node.path, name, content))
  }

  const rootNodes = values(state).filter(n => n.isRoot)

  return (
    <React.Fragment>
      <Header>
        <h3>Models</h3>
        <div>
          <button disabled onClick={() => addRootPackage()}>
            New Package
          </button>
        </div>
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
                type: 'file',
                action: 'use-template',
                onExecute: addAsset,
                label: 'Add template to blueprint',
              },
              // commented out until functionality is implemented.
              // 	{
              // 	  action: 'add-package',
              // 	  onClick: () => addPackage(node),
              // 	  label: 'Add Package',
              // 	},
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
                onNodeSelect={() => {}}
              />
            )
          })}
      </div>
    </React.Fragment>
  )
}
