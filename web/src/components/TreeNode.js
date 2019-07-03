import React from 'react'
import {
  FaFile,
  FaFolder,
  FaFolderOpen,
  FaChevronDown,
  FaChevronRight,
} from 'react-icons/fa'
import styled from 'styled-components'
import last from 'lodash/last'
import PropTypes from 'prop-types'
import ContextMenu from '../components/context-menu/ContextMenu'

const getPaddingLeft = (level, type) => {
  let paddingLeft = level * 20
  if (type === 'file') paddingLeft += 20
  return paddingLeft
}

//@todo fix hover when contextMenu is open. https://codepen.io/Iulius90/pen/oLaNoJ
const StyledTreeNode = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 5px 8px;
  padding-left: ${props => getPaddingLeft(props.level, props.type)}px;

  &:hover {
    background: lightgray;
  }
`

const NodeIcon = styled.div`
  font-size: 12px;
  margin-right: ${props => (props.marginRight ? props.marginRight : 5)}px;
`

const getNodeLabel = node => last(node.path.split('/'))

const TreeNode = props => {
  const {
    node,
    getChildNodes,
    level,
    onToggle,
    onNodeSelect,
    addPackage,
    addFile,
    addAsset,
  } = props

  const menuItemsFolder = [
    {
      action: 'add-package',
      onClick: () => addPackage(node),
      label: 'Add Package',
    },
    { action: 'add-file', onClick: () => addFile(node), label: 'Add File' },
  ]

  const menuItemsFile = [
    {
      action: 'use-template',
      onClick: () => addAsset(node),
      label: 'Add template to blueprint',
    },
  ]
  const menuItems = node.type === 'folder' ? menuItemsFolder : menuItemsFile

  return (
    <React.Fragment>
      <StyledTreeNode level={level} type={node.type}>
        <NodeIcon onClick={() => onToggle(node)}>
          {node.type === 'folder' &&
            (node.isOpen ? <FaChevronDown /> : <FaChevronRight />)}
        </NodeIcon>

        <NodeIcon marginRight={10}>
          {node.type === 'file' && <FaFile />}
          {node.type === 'folder' && node.isOpen === true && <FaFolderOpen />}
          {node.type === 'folder' && !node.isOpen && <FaFolder />}
        </NodeIcon>

        <span role="button" onClick={() => onNodeSelect(node)}>
          <ContextMenu id={node.path} menuItems={menuItems}>
            {getNodeLabel(node)}
          </ContextMenu>
        </span>
      </StyledTreeNode>

      {node.isOpen &&
        getChildNodes(node)
          .filter(node => !node.isHidden)
          .map(childNode => (
            <TreeNode
              key={'treenode' + childNode.path}
              {...props}
              node={childNode}
              level={level + 1}
            />
          ))}
    </React.Fragment>
  )
}

TreeNode.propTypes = {
  node: PropTypes.object.isRequired,
  getChildNodes: PropTypes.func.isRequired,
  level: PropTypes.number.isRequired,
  onToggle: PropTypes.func.isRequired,
  onNodeSelect: PropTypes.func.isRequired,
}

TreeNode.defaultProps = {
  level: 0,
}

export default TreeNode
