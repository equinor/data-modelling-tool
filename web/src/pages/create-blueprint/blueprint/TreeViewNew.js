import React from 'react'
import values from 'lodash/values'
import { Actions } from './CreateBluePrintReducer'
import TreeNode from '../../../components/tree-view/TreeNode'
import SearchTree from '../../../components/tree-view/SearchTree'

export default props => {
  const { nodes, dispatch } = props

  const onToggle = node => {
    dispatch(Actions.toggleNode(node.path))
  }
  const rootNodes = values(nodes)
  return (
    <div>
      <h3>Blue print</h3>
      <div>
        <SearchTree onChange={value => dispatch(Actions.filterTree(value))} />
      </div>
      <div>
        {rootNodes
          .filter(node => !node.isHidden)
          .map(node => {
            return (
              <TreeNode
                key={'createBlueprint' + node.path}
                node={node}
                nodes={nodes}
                existing={true}
                onToggle={onToggle}
                menuItems={[]}
                onNodeSelect={node => {
                  dispatch(Actions.setSelectedTemplatePath(node.path))
                }}
              />
            )
          })}
      </div>
    </div>
  )
}
