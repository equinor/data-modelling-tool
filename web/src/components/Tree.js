import React from 'react'
import values from 'lodash/values'
import PropTypes from 'prop-types'

import TreeNode from './TreeNode'
import { Actions } from './tree-view/TreeReducer'

/*
https://medium.com/@davidtranwd/implement-tree-view-component-with-reactjs-and-styled-components-5eea3b1603cf
*/
const getRootNodes = nodes => {
  return values(nodes).filter(node => node.isRoot === true)
}

function Tree(props) {
  const { data, dispatch, onSelect, existing, dispatchAddFile } = props
  const nodes = data

  const getChildNodes = node => {
    if (!node.children) return []
    return node.children.map(path => nodes[path])
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

  const addAsset = node => {
    dispatchAddFile && dispatchAddFile(Actions.addNodes(nodes, node.path))
  }

  const handleFilterMouseUp = e => {
    const filter = e.target.value.trim()
    dispatch(Actions.filterTree(filter))
  }

  const rootNodes = getRootNodes(nodes)

  return (
    <div>
      <div>
        <input placeholder="Search" onKeyUp={handleFilterMouseUp} />
      </div>
      {rootNodes
        .filter(node => !node.isHidden)
        .map(node => (
          <TreeNode
            key={node.path}
            node={node}
            existing={existing}
            getChildNodes={getChildNodes}
            onToggle={onToggle}
            addPackage={addPackage}
            addFile={addFile}
            addAsset={addAsset}
            onNodeSelect={onSelect}
          />
        ))}
    </div>
  )
}

Tree.propTypes = {
  onSelect: PropTypes.func.isRequired,
}

export default Tree
